import Character from "./Character";

class CombatActions {
    constructor(character, opponent, scene) {
        this.character = character;
        this.opponent = opponent;
        this.scene = scene;
        this.attackTypes = {
            punch: {
                requiredStamina: 10,
                attackMin: 0.25,
                damageMultiplier: 1.5,
                luckFactor: 0.75,
            },
            kick: {
                requiredStamina: 25,
                attackMin: 0.5,
                damageMultiplier: 2,
                luckFactor: 0.5,
            },
            special: {
                requiredStamina: 50,
                attackMin: 0.75,
                damageMultiplier: 2.5,
                luckFactor: 0.25,
            },
        };
        this.character.damageBlocked = 0;
        this.opponent.damageBlocked = 0;
    }

    flickerCharacter(target, duration = 500) {
        if (!target || !target.setAlpha) {
            console.error("Invalid target for flickerCharacter:", target);
            return;
        }

        let flickerInterval = 100;
        let flickerCount = duration / flickerInterval;
        let flickerTween = this.scene.tweens.addCounter({
            from: 1,
            to: 0,
            duration: flickerInterval,
            repeat: flickerCount,
            onUpdate: (tween) => {
                let value = tween.getValue();
                target.setAlpha(value);
            },
            onComplete: () => {
                target.setAlpha(1);
            },
        });
    }

    performAttack(attackType, onComplete) {
        const { requiredStamina, damageMultiplier, attackMin, luckFactor } =
            this.attackTypes[attackType];
        const characterName = this.character.name;
        const opponentName = this.opponent.name;
        const scene = this.scene;

        scene.updatePopupText(
            `${characterName} charges \nhis ${attackType} attack!`
        );

        if (this.character.currentStamina >= requiredStamina) {
            this.character.updateStamina(-requiredStamina);
        } else {
            scene.updatePopupText(
                `${characterName} is too exhausted \nand MISSES...`
            );
            scene.time.delayedCall(2000, () => {
                this.character.updateStamina(-this.character.currentStamina);
                if (onComplete) onComplete();
            });
            return;
        }

        scene.time.delayedCall(1000, () => {
            if (this.opponent.currentHealth > 0) {
                if (attackType === "special" || this.attackHits()) {
                    this.calculateDamage(
                        damageMultiplier,
                        luckFactor,
                        attackMin,
                        attackType,
                        onComplete
                    );
                } else {
                    scene.updatePopupText(
                        `${characterName} is too slow \nand MISSES!`
                    );
                    scene.time.delayedCall(2000, () => {
                        if (onComplete) onComplete();
                    });
                }
            } else {
                scene.updatePopupText(
                    `${characterName} is too exhausted \nand MISSES...`
                );
                scene.time.delayedCall(2000, () => {
                    this.character.updateStamina(
                        -this.character.currentStamina
                    );
                    if (onComplete) onComplete();
                });
            }
        });
    }

    attackHits() {
        let characterAgility = Math.ceil(
            Math.random() * (this.character.agility / 2) +
                (this.character.agility / 2) * this.character.swiftnessBoost
        );
        let opponentReflexes = Math.ceil(
            Math.random() * this.opponent.reflexes
        );

        return characterAgility > opponentReflexes;
    }

    calculateDamage(
        damageMultiplier,
        luckFactor,
        attackMin,
        attackType,
        onComplete
    ) {
        const characterName = this.character.name;
        const opponentName = this.opponent.name;
        const scene = this.scene;

        scene.time.delayedCall(500, () => {
            console.log("damageMultiplier", damageMultiplier);
            console.log("attackBase", attackMin);
            let characterStrength = Math.ceil(
                Math.random() * (this.character.strength * attackMin) +
                    this.character.strength *
                        attackMin *
                        this.character.powerBoost
            );
            scene.updatePopupText(
                `${characterName}'s power \nsurges to ${characterStrength}!`
            );

            let opponentDefense = Math.ceil(
                Math.random() * this.opponent.defense
            );
            if (opponentDefense > this.opponent.currentStamina) {
                opponentDefense = this.opponent.currentStamina;
            }

            scene.updatePopupText(
                `${opponentName} braces \nfor the attack ...`
            );

            let basicDamage = characterStrength - opponentDefense;
            if (basicDamage <= 0) {
                scene.updatePopupText(
                    `${opponentName} BLOCKS \nthe attack FULLY, \nlosing ${characterStrength} stamina. \n\n${characterName} deals \nNO DAMAGE!`
                );
                this.opponent.updateStamina(-characterStrength);
                this.opponent.damageBlocked -= -characterStrength;
                scene.time.delayedCall(3500, () => {
                    if (onComplete) onComplete();
                });
            } else {
                const luck = Math.random();
                let totalDamage;
                if (luck >= luckFactor) {
                    totalDamage = Math.ceil(basicDamage * damageMultiplier);
                    this.playSound(attackType, true);
                    this.flickerCharacter(this.opponent.sprite, 1500);
                    scene.updatePopupText(
                        `${characterName} lands a MASSIVE ${attackType}!`
                    );

                    this.opponent.updateHealth(totalDamage * -1);
                    this.opponent.updateStamina(-opponentDefense);
                    this.opponent.damageBlocked -= opponentDefense;

                    scene.time.delayedCall(2500, () => {
                        console.log("text about damage blocked");

                        // Debug output to verify values
                        console.log("opponentDefense:", opponentDefense);
                        console.log("totalDamage:", totalDamage);

                        if (opponentDefense === 0) {
                            console.log("OD = 0", opponentDefense);
                            scene.updatePopupText(
                                `${opponentName} is caught \noff guard and \nblocks no damage. \n\n${characterName} deals \n${totalDamage} DAMAGE!`
                            );
                        } else {
                            if (totalDamage === 0) {
                                console.log("Total Damage is 0", totalDamage);
                                scene.updatePopupText(
                                    `${opponentName} BLOCKS \nthe attack FULLY, \nlosing ${characterStrength} stamina. \n\n${characterName} deals \nNO DAMAGE!`
                                );
                            } else {
                                console.log(
                                    "Total Damage is not 0",
                                    totalDamage
                                );
                                scene.updatePopupText(
                                    `${opponentName} blocks some\nof the damage, \nlosing ${opponentDefense} stamina. \n\n${characterName} deals \n${totalDamage} DAMAGE!`
                                );
                            }
                        }
                        scene.time.delayedCall(3500, () => {
                            if (onComplete) onComplete();
                        });
                    });
                } else {
                    totalDamage = basicDamage;
                    this.playSound(attackType, false);
                    this.flickerCharacter(this.opponent.sprite, 500);
                    scene.updatePopupText(
                        `${characterName} lands \na regular ${attackType}!`
                    );

                    this.opponent.updateHealth(totalDamage * -1);
                    this.opponent.updateStamina(-opponentDefense);
                    this.opponent.damageBlocked -= opponentDefense;
                    console.log("OD reduced from stamina", opponentDefense);

                    scene.time.delayedCall(2500, () => {
                        console.log("text about damage blocked");
                        if (opponentDefense === 0) {
                            console.log("OD = 0", opponentDefense);
                            scene.updatePopupText(
                                `${opponentName} is caught \noff guard and \nblocks no damage. \n\n${characterName} deals \n${totalDamage} DAMAGE!`
                            );
                        } else {
                            if (totalDamage === 0) {
                                scene.updatePopupText(
                                    `${opponentName} BLOCKS \nthe attack FULLY, \nlosing ${characterStrength} stamina. \n\n${characterName} deals \nNO DAMAGE!`
                                );
                            } else {
                                scene.updatePopupText(
                                    `${opponentName} blocks some\nof the damage, \nlosing ${opponentDefense} stamina. \n\n${characterName} deals \n${totalDamage} DAMAGE!`
                                );
                            }
                        }
                        scene.time.delayedCall(3500, () => {
                            if (onComplete) onComplete();
                        });
                    });
                }
            }
        });
    }

    playSound(attackType, isMassive) {
        const scene = this.scene;
        const target = this.opponent.sprite;

        const playAnimation = (
            offsetX,
            offsetY,
            scale,
            spriteKey = "punchReg"
        ) => {
            const sprite =
                spriteKey === "special"
                    ? scene.specialSprite
                    : scene.punchSprite;
            sprite.setPosition(target.x + offsetX, target.y + offsetY);
            sprite.setScale(scale);
            sprite.setDepth(10);
            sprite.setVisible(true).play(spriteKey);

            sprite.once("animationcomplete", () => {
                sprite.setVisible(false);
            });
        };

        if (attackType === "special") {
            if (isMassive) {
                scene.time.delayedCall(250, () => {
                    let soundNumber = Phaser.Math.Between(10, 18);
                    scene.sound.play("special");
                    let offsetX = Phaser.Math.Between(-150, 150);
                    let offsetY = Phaser.Math.Between(-150, 150);
                    playAnimation(offsetX, offsetY, 0.5, "special");
                });

                scene.time.delayedCall(750, () => {
                    scene.sound.play("special");
                    let offsetX = Phaser.Math.Between(-150, 150);
                    let offsetY = Phaser.Math.Between(-150, 150);
                    playAnimation(offsetX, offsetY, 1, "special");
                });

                scene.time.delayedCall(1250, () => {
                    let soundNumber = Phaser.Math.Between(10, 18);
                    scene.sound.play("special");
                    let offsetX = Phaser.Math.Between(-150, 150);
                    let offsetY = Phaser.Math.Between(-150, 150);
                    playAnimation(offsetX, offsetY, 0.5, "special");
                });
            } else {
                let soundNumber = Phaser.Math.Between(10, 18);
                scene.sound.play("special");
                let offsetX = Phaser.Math.Between(-150, 150);
                let offsetY = Phaser.Math.Between(-150, 150);
                playAnimation(offsetX, offsetY, 0.35, "special");
            }
        } else {
            const soundPrefix = attackType === "punch" ? "punch" : "kick";

            if (!isMassive) {
                let soundNumber = Phaser.Math.Between(1, 9);
                scene.sound.play(`${soundPrefix}${soundNumber}`);
                let offsetX = Phaser.Math.Between(-150, 150);
                let offsetY = Phaser.Math.Between(-150, 150);
                playAnimation(offsetX, offsetY, 0.35);
            } else {
                scene.time.delayedCall(250, () => {
                    let soundNumber = Phaser.Math.Between(1, 9);
                    scene.sound.play(`${soundPrefix}${soundNumber}`);
                    let offsetX = Phaser.Math.Between(-150, 150);
                    let offsetY = Phaser.Math.Between(-150, 150);
                    playAnimation(offsetX, offsetY, 0.35);
                });

                scene.time.delayedCall(750, () => {
                    scene.sound.play(
                        `massive${
                            soundPrefix.charAt(0).toUpperCase() +
                            soundPrefix.slice(1)
                        }`
                    );
                    let offsetX = Phaser.Math.Between(-150, 150);
                    let offsetY = Phaser.Math.Between(-150, 150);
                    playAnimation(offsetX, offsetY, 0.85);
                });

                scene.time.delayedCall(1250, () => {
                    let soundNumber = Phaser.Math.Between(1, 9);
                    scene.sound.play(`${soundPrefix}${soundNumber}`);
                    let offsetX = Phaser.Math.Between(-150, 150);
                    let offsetY = Phaser.Math.Between(-150, 150);
                    playAnimation(offsetX, offsetY, 0.35);
                });
            }
        }
    }

    punch(onComplete) {
        this.performAttack("punch", onComplete);
    }

    kick(onComplete) {
        this.performAttack("kick", onComplete);
    }

    special(onComplete) {
        this.performAttack("special", onComplete);
    }

    guard(onComplete) {
        const scene = this.scene;

        const baseHealthIncrease = Math.ceil(
            this.character.defense + this.character.defense
        );
        const baseStaminaIncrease = Math.ceil(
            this.character.agility + this.character.agility
        );

        const randomFactor = Phaser.Math.FloatBetween(0.75, 1.25);
        const healthIncrease = Math.ceil(baseHealthIncrease * randomFactor);
        const staminaIncrease = Math.ceil(baseStaminaIncrease * randomFactor);

        this.scene.updatePopupText(
            `${this.character.name} defends! \n\n He restores: \n\n${healthIncrease} HEALTH \n${staminaIncrease} STAMINA.`
        );
        this.character.updateHealth(healthIncrease);
        this.character.updateStamina(staminaIncrease);
        scene.time.delayedCall(3500, () => {
            if (onComplete) onComplete();
        });
    }
}

export default CombatActions;

