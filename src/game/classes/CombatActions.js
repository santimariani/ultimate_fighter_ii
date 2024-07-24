import Character from "./Character";

class CombatActions {
    constructor(character, opponent, scene) {
        this.character = character;
        this.opponent = opponent;
        this.scene = scene; // Assign the scene to this class
        this.attackTypes = {
            punch: {
                requiredStamina: 10,
                damageMultiplier: 2,
                luckFactor: 0.75,
            },
            kick: {
                requiredStamina: 25,
                damageMultiplier: 3,
                luckFactor: 0.5,
            },
            special: {
                requiredStamina: 50,
                damageMultiplier: 10,
                luckFactor: 0,
            },
        };
        this.character.damageBlocked = 0;
        this.opponent.damageBlocked = 0;
    }

    flickerCharacter(target, duration = 500) {
        if (!target || !target.setAlpha) {
            console.error('Invalid target for flickerCharacter:', target);
            return;
        }
        
        let flickerInterval = 50; // Interval in milliseconds for each flicker
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
            }
        });
    }
    
    performAttack(attackType, onComplete) {
        const { requiredStamina, damageMultiplier, luckFactor } =
            this.attackTypes[attackType];
        const characterName = this.character.name;
        const scene = this.scene;

        scene.updatePopupText(`${characterName} attempts to ${attackType}!`);

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
                        `${characterName} is too slow and misses!`
                    );
                    scene.time.delayedCall(1000, () => {
                        if (onComplete) onComplete();
                    });
                }
            } else {
                scene.updatePopupText(
                    `${characterName} is too exhausted and misses...`
                );
                scene.time.delayedCall(1000, () => {
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

        scene.time.delayedCall(1000, () => {
            let characterStrength = Math.ceil(
                Math.random() * (this.character.strength / 2) +
                    (this.character.strength / 2) * this.character.powerBoost
            );
            scene.updatePopupText(
                `${characterName} power surges to ${characterStrength}!`
            );

            scene.time.delayedCall(1000, () => {
                let opponentDefense = Math.ceil(
                    Math.random() * this.opponent.defense
                );
                if (opponentDefense > this.opponent.currentStamina) {
                    opponentDefense = this.opponent.currentStamina;
                }
                console.log(
                    `${opponentName} braces for the attack with ${opponentDefense} defense power!`
                );
                scene.updatePopupText(
                    `${opponentName} braces for the attack...`
                );

                scene.time.delayedCall(1000, () => {
                    let basicDamage = characterStrength - opponentDefense;
                    if (basicDamage <= 0) {
                        scene.updatePopupText(
                            `${characterName} lands the blow but ${opponentName} blocks all the damage!`
                        );
                        scene.time.delayedCall(1000, () => {
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
                                `${characterName} lands a MASSIVE ${attackType}, increasing his damage!`
                            );

                            scene.time.delayedCall(1500, () => {
                                scene.updatePopupText(
                                    `${opponentName} blocks ${opponentDefense} damage, \nreducing his stamina, \nand ${characterName} deals ${totalDamage} damage!`
                                );
                                this.opponent.updateHealth(totalDamage * -1);
                                this.opponent.updateStamina(-opponentDefense);
                                scene.time.delayedCall(1000, () => {
                                    if (onComplete) onComplete();
                                });
                            });
                        } else {
                            totalDamage = basicDamage;
                            this.playSound(attackType, false);
                            this.flickerCharacter(this.opponent.sprite, 500);
                            scene.updatePopupText(
                                `${characterName} lands a regular ${attackType}!`
                            );

                            scene.time.delayedCall(1500, () => {
                                scene.updatePopupText(
                                    `${opponentName} blocks ${opponentDefense} damage, \nreducing his stamina, \nand ${characterName} deals ${totalDamage} damage!`
                                );
                                this.opponent.updateHealth(totalDamage * -1);
                                this.opponent.updateStamina(-opponentDefense);
                                scene.time.delayedCall(1000, () => {
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
        if (attackType === 'special') {
            this.scene.sound.play('special');
            return;
        }

        const soundPrefix = attackType === 'punch' ? 'punch' : 'kick';
        if (isMassive) {
            let soundNumber = Phaser.Math.Between(1, 9);
            this.scene.sound.play(`${soundPrefix}${soundNumber}`);
            scene.time.delayedCall(500, () => {
                this.scene.sound.play(`massive${soundPrefix.charAt(0).toUpperCase() + soundPrefix.slice(1)}`);
            });
            scene.time.delayedCall(1000, () => {
                let soundNumber = Phaser.Math.Between(1, 9);
                this.scene.sound.play(`${soundPrefix}${soundNumber}`);
            });
        } else {
            const soundNumber = Phaser.Math.Between(1, 9);
            this.scene.sound.play(`${soundPrefix}${soundNumber}`);
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
        this.scene.sound.play('special');
    }

    guard(onComplete) {
        console.log(`${this.character.name} defends!`);
        this.scene.updatePopupText(`${this.character.name} defends!`);
        const healthIncrease = Math.ceil(
            this.character.defense + this.character.strength
        );
        const staminaIncrease = Math.ceil(
            this.character.agility + this.character.reflexes
        );
        console.log(
            `${this.character.name}'s health increased ${healthIncrease} and stamina ${staminaIncrease}`
        );
        this.scene.updatePopupText(
            `${this.character.name}'s health increased ${healthIncrease} and stamina ${staminaIncrease}`
        );
        this.character.updateHealth(healthIncrease);
        this.character.updateStamina(staminaIncrease);
        if (onComplete) onComplete();
    }
}

export default CombatActions;

