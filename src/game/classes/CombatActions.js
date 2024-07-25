import Character from "./Character";

class CombatActions {
    constructor(character, opponent, scene) {
        this.character = character;
        this.opponent = opponent;
        this.scene = scene; // Assign the scene to this class
        this.attackTypes = {
            punch: {
                requiredStamina: 10,
                damageMultiplier: 1.5,
                luckFactor: 0.75,
            },
            kick: {
                requiredStamina: 25,
                damageMultiplier: 3,
                luckFactor: 0.5,
            },
            special: {
                requiredStamina: 75,
                damageMultiplier: 6,
                luckFactor: 0,
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

        let flickerInterval = 100; // Interval in milliseconds for each flicker
        let flickerCount = duration / flickerInterval; // Number of flickers
        let flickerTween = this.scene.tweens.addCounter({
            from: 1,
            to: 0,
            duration: flickerInterval,
            repeat: flickerCount,
            onUpdate: (tween) => {
                let value = tween.getValue();
                target.setAlpha(value); // Change the transparency
            },
            onComplete: () => {
                target.setAlpha(1); // Ensure it's fully visible at the end
            },
        });
    }

    performAttack(attackType, onComplete) {
        const { requiredStamina, damageMultiplier, luckFactor } =
            this.attackTypes[attackType];
        const characterName = this.character.name;
        const opponentName = this.opponent.name;
        const scene = this.scene;

        if (attackType === "special") {
            scene.updatePopupText(`${characterName} charges \nhis ${attackType} attack!`);
        } else {
            scene.updatePopupText(`${characterName} attempts \nto ${attackType} the ${opponentName}!`);
        }

        scene.time.delayedCall(1000, () => {
            if (
                this.opponent.currentHealth > 0 &&
                this.character.currentStamina >= requiredStamina
            ) {
                this.character.updateStamina(-requiredStamina);
                if (attackType === "special" || this.attackHits()) {
                    this.calculateDamage(
                        damageMultiplier,
                        luckFactor,
                        attackType,
                        onComplete
                    );
                } else {
                    scene.updatePopupText(
                        `${characterName} is too slow \nand misses!`
                    );
                    scene.time.delayedCall(4000, () => {
                        if (onComplete) onComplete();
                    });
                }
            } else {
                scene.updatePopupText(
                    `${characterName} is too exhausted \nand misses...`
                );
                scene.time.delayedCall(4000, () => {
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

    calculateDamage(damageMultiplier, luckFactor, attackType, onComplete) {
        const characterName = this.character.name;
        const opponentName = this.opponent.name;
        const scene = this.scene;

        scene.time.delayedCall(500, () => {
            let characterStrength = Math.ceil(
                Math.random() * (this.character.strength / 2) +
                    (this.character.strength / 2) * this.character.powerBoost
            );
            scene.updatePopupText(
                `${characterName}'s power \nsurges to ${characterStrength}!`
            );

            scene.time.delayedCall(2000, () => {
                let opponentDefense = Math.ceil(
                    Math.random() * this.opponent.defense
                );
                if (opponentDefense > this.opponent.currentStamina) {
                    opponentDefense = this.opponent.currentStamina;
                }

                scene.updatePopupText(
                    `${opponentName} braces \nfor the attack ...`
                );

                scene.time.delayedCall(1500, () => {
                    let basicDamage = characterStrength - opponentDefense;
                    if (basicDamage <= 0) {
                        scene.updatePopupText(
                            `${characterName} lands the blow \nbut ${opponentName} blocks \nall the damage!`
                        );
                        scene.time.delayedCall(5000, () => {
                            if (onComplete) onComplete();
                        });
                    } else {
                        const luck = Math.random();
                        let totalDamage;
                        if (luck >= luckFactor) {
                            totalDamage = Math.ceil(
                                basicDamage * damageMultiplier
                            );
                            this.playSound(attackType, true);
                            this.flickerCharacter(this.opponent.sprite, 1500);
                            scene.updatePopupText(
                                `${characterName} lands a MASSIVE ${attackType}!`
                            );

                            scene.time.delayedCall(2500, () => {
                                scene.updatePopupText(
                                    `${opponentName} blocks \n${opponentDefense} damage, \nlosing stamina. \n\n${characterName} deals \n${totalDamage} DAMAGE!`
                                );
                                this.opponent.updateHealth(totalDamage * -1);
                                this.opponent.updateStamina(-opponentDefense);
                                scene.time.delayedCall(5000, () => {
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

                            scene.time.delayedCall(2500, () => {
                                scene.updatePopupText(
                                    `${opponentName} blocks \n${opponentDefense} damage, \nlosing stamina. \n\n${characterName} deals \n${totalDamage} DAMAGE!`
                                );
                                this.opponent.updateHealth(totalDamage * -1);
                                this.opponent.updateStamina(-opponentDefense);
                                scene.time.delayedCall(5000, () => {
                                    if (onComplete) onComplete();
                                });
                            });
                        }
                    }
                });
            });
        });
    }

    playSound(attackType, isMassive) {
        const scene = this.scene;
        const target = this.opponent.sprite;
    
        // Helper function to play the animation and sound
        const playAnimation = (scale, spriteKey = 'punchReg') => {
            let randomOffsetX = Phaser.Math.Between(-15, 15); // Randomness within model
            let randomOffsetY = Phaser.Math.Between(-15, 15); // Randomness within model
            const sprite = spriteKey === 'special' ? scene.specialSprite : scene.punchSprite;
            sprite.setPosition(target.x + randomOffsetX, target.y + randomOffsetY);
            sprite.setScale(scale); // Adjust size
            sprite.setDepth(10); // Ensure it appears above other elements
            sprite.setVisible(true).play(spriteKey);
    
            sprite.once("animationcomplete", () => {
                sprite.setVisible(false);
            });
        };
    
        if (attackType === "special") {
            if (isMassive) {
                // Massive special attack sequence
                scene.time.delayedCall(250, () => {
                    let soundNumber = Phaser.Math.Between(10, 18);
                    scene.sound.play("special");
                    playAnimation(0.50, 'special'); // Regular size, special animation
                });
    
                scene.time.delayedCall(750, () => {
                    scene.sound.play("special");
                    playAnimation(1, 'special'); // Massive size, special animation
                });
    
                scene.time.delayedCall(1250, () => {
                    let soundNumber = Phaser.Math.Between(10, 18);
                    scene.sound.play("special");
                    playAnimation(0.5, 'special'); // Regular size, special animation
                });
            } else {
                // Regular special attack sequence
                let soundNumber = Phaser.Math.Between(10, 18);
                scene.sound.play("special");
                playAnimation(0.35, 'special'); // Regular size, special animation
            }
        } else {
            // Handle punch/kick attacks
            const soundPrefix = attackType === "punch" ? "punch" : "kick";
    
            if (!isMassive) {
                let soundNumber = Phaser.Math.Between(1, 9);
                scene.sound.play(`${soundPrefix}${soundNumber}`);
                playAnimation(0.35); // Regular size
            } else {
                // Massive attack sequence
                let soundNumber = Phaser.Math.Between(1, 9);
    
                scene.time.delayedCall(250, () => {
                    soundNumber = Phaser.Math.Between(1, 9);
                    scene.sound.play(`${soundPrefix}${soundNumber}`);
                    playAnimation(0.35); // Regular size
                });
    
                scene.time.delayedCall(750, () => {
                    scene.sound.play(`massive${soundPrefix.charAt(0).toUpperCase() + soundPrefix.slice(1)}`);
                    playAnimation(.85); // Massive size
                });
    
                scene.time.delayedCall(1250, () => {
                    soundNumber = Phaser.Math.Between(1, 9);
                    scene.sound.play(`${soundPrefix}${soundNumber}`);
                    playAnimation(0.35); // Regular size
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
        const healthIncrease = Math.ceil(
            this.character.defense + this.character.strength
        );
        const staminaIncrease = Math.ceil(
            this.character.agility + this.character.reflexes
        );
        this.scene.updatePopupText(
            `${this.character.name} defends! \n\n He restores \n${healthIncrease} HEALTH \nand  ${staminaIncrease} STAMINA.`
        );
        this.character.updateHealth(healthIncrease);
        this.character.updateStamina(staminaIncrease);
        scene.time.delayedCall(5000, () => {
            if (onComplete) onComplete();
        });
    }
}

export default CombatActions;

