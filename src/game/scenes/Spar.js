import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightRoundsStateMachine } from "../stateMachines/FightRoundsStateMachine";
import CombatActions from "../classes/CombatActions";

export class Spar extends Scene {
    constructor() {
        super("Spar");
        this.fightStateMachine = null;
        this.isInitialized = false;
        this.heroTotalDamageCaused = 0;
        this.heroTotalDamageBlocked = 0;
        this.enemyTotalDamageCaused = 0;
        this.enemyTotalDamageBlocked = 0;
        this.isGamePaused = false;
    }

    init(data) {
        this.hero = this.registry.get("hero");
        this.enemy = this.registry.get("enemy");
        this.heroCombatActions = new CombatActions(this.hero, this.enemy, this); // Pass the scene
        this.enemyCombatActions = new CombatActions(
            this.enemy,
            this.hero,
            this
        ); // Pass the scene

        // Override the updateHealth method to track damage
        this.hero.updateHealth = (amount) => {
            if (amount < 0) {
                this.enemyTotalDamageCaused += Math.abs(amount);
            }
            this.hero.currentHealth += amount;
            if (this.hero.currentHealth > this.hero.totalHealth) {
                this.hero.currentHealth = this.hero.totalHealth;
            } else if (this.hero.currentHealth < 0) {
                this.hero.currentHealth = 0;
            }
        };

        this.enemy.updateHealth = (amount) => {
            if (amount < 0) {
                this.heroTotalDamageCaused += Math.abs(amount);
            }
            this.enemy.currentHealth += amount;
            if (this.enemy.currentHealth > this.enemy.totalHealth) {
                this.enemy.currentHealth = this.enemy.totalHealth;
            } else if (this.enemy.currentHealth < 0) {
                this.enemy.currentHealth = 0;
            }
        };
    }

    create() {
        this.hero.sprite = this.add.image(100, 100, 'heroSprite').setVisible(false);
        this.enemy.sprite = this.add.image(500, 100, 'enemySprite').setVisible(false);
    
        
        const centerPopUpX = this.cameras.main.width / 2;
        const centerPopUpY = this.cameras.main.height / 2;
        this.popupBackground = this.add.graphics();
        this.popupBackground.fillStyle(0x000000, 0.7);
        this.popupBackground.fillRect(
            centerPopUpX - 200,
            centerPopUpY - 100,
            400,
            200
        );
        this.popupBackground.setVisible(false);
        this.popupBackground.setDepth(10);

        this.popupText = this.add
            .text(centerPopUpX, centerPopUpY, "", {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                align: "center",
                wordWrap: { width: 380, useAdvancedWrap: true },
            })
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(14);

        this.sparIntro = this.sound.add("sparIntro", {
            loop: false,
            volume: 0.5,
        });
        this.sparLoop = this.sound.add("sparLoop", {
            loop: true,
            volume: 0.5,
        });

        // Define volume levels
        const VOLUME_LEVELS = {
            SOFT: 0.5,
            NORMAL: 1,
            LOUD: 1.5,
        };

        // Load sounds with specified volume levels
        this.punch1 = this.sound.add("punch1", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch2 = this.sound.add("punch2", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch3 = this.sound.add("punch3", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch4 = this.sound.add("punch4", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch5 = this.sound.add("punch5", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch6 = this.sound.add("punch6", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch7 = this.sound.add("punch7", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch8 = this.sound.add("punch8", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.punch9 = this.sound.add("punch9", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });

        this.massivePunch = this.sound.add("massivePunch", {
            loop: false,
            volume: VOLUME_LEVELS.NORMAL,
        });

        this.kick1 = this.sound.add("kick1", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick2 = this.sound.add("kick2", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick3 = this.sound.add("kick3", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick4 = this.sound.add("kick4", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick5 = this.sound.add("kick5", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick6 = this.sound.add("kick6", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick7 = this.sound.add("kick7", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick8 = this.sound.add("kick8", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });
        this.kick9 = this.sound.add("kick9", {
            loop: false,
            volume: VOLUME_LEVELS.SOFT,
        });

        this.massiveKick = this.sound.add("massiveKick", {
            loop: false,
            volume: VOLUME_LEVELS.NORMAL,
        });

        this.special = this.sound.add("special", {
            loop: false,
            volume: VOLUME_LEVELS.LOUD,
        });
        EventBus.on("muteGame", this.muteGame, this);
        EventBus.on("pauseGame", this.pauseGame, this);
        EventBus.on("resumeGame", this.resumeGame, this);

        // Add characters and text with appropriate delays
        this.time.delayedCall(750, this.addLeftFighter, [], this);
        this.time.delayedCall(2300, this.addVsText, [], this);
        this.time.delayedCall(2850, this.addRightFighter, [], this);
        this.time.delayedCall(5100, this.updateBackgroundAndText, [], this);
        this.time.delayedCall(6650, this.showStatsAndRemoveFight, [], this);

        // Add hero and enemy stats text, initially hidden
        this.heroHealthText = this.add
            .text(16, 16, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);
        this.heroPowerBoost = this.add
            .text(16, 48, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);
        this.heroStaminaText = this.add
            .text(16, 80, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);
        this.heroSwiftnessBoost = this.add
            .text(16, 112, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);
        this.enemyHealthText = this.add
            .text(550, 16, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);
        this.enemyPowerBoost = this.add
            .text(550, 48, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);
        this.enemyStaminaText = this.add
            .text(550, 80, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);
        this.enemySwiftnessBoost = this.add
            .text(550, 112, "", {
                fontSize: "32px",
                fill: "white",
            })
            .setVisible(false);

        this.updateTextElements();

        // Event listeners for combat actions
        this.events.on(
            "punch",
            this.heroCombatActions.punch.bind(this.heroCombatActions)
        );
        this.events.on(
            "kick",
            this.heroCombatActions.kick.bind(this.heroCombatActions)
        );
        this.events.on(
            "special",
            this.heroCombatActions.special.bind(this.heroCombatActions)
        );
        this.events.on(
            "guard",
            this.heroCombatActions.guard.bind(this.heroCombatActions)
        );

        this.events.on(
            "heroGo",
            () => {
                EventBus.emit("playerTurn");
                this.updatePopupText(
                    `${this.hero.name} considers his options...`
                );
                EventBus.emit("enablePlayerButtons");
            },
            this
        );

        this.events.on("enemyGo", this.enemyAction, this);

        this.events.on("fightEnded", this.changePostFightScene, this);

        EventBus.on("playerAction", this.heroAction.bind(this));

        // this.fightStateMachine = new FightRoundsStateMachine(this);
        // this.fightStateMachine.start();

        EventBus.emit("current-scene-ready", this);

        EventBus.on("updateUi", (x) => {
            return this.updateStatsUi(x);
        });

        // Add round counter text, initially hidden
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 8;

        this.roundText = this.add
            .text(centerX, centerY, "8", {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false);

        this.roundLabel = this.add
            .text(centerX, centerY - 75, "ROUNDS", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false);

        this.roundLeft = this.add
            .text(centerX, centerY - 45, "LEFT", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false);

        // Show the round counter when other texts are shown
        this.events.on("showRoundCounter", () => {
            this.roundText.setVisible(true);
            this.roundLabel.setVisible(true);
            this.roundLeft.setVisible(true);
        });

        // Update the round counter text when the round changes
        this.events.on("roundChanged", (roundNumber) => {
            this.roundText.setText(`${11 - roundNumber}`);
        });

        const centerPauseX = this.cameras.main.width / 2;
        const centerPauseY = this.cameras.main.height / 2;

        this.pauseBackground = this.add.graphics();
        this.pauseBackground.fillStyle(0x000000, 0.9);
        this.pauseBackground.fillRect(
            centerPauseX - 200,
            centerPauseY - 100,
            400,
            200
        );
        this.pauseBackground.setVisible(false);
        this.pauseBackground.setDepth(10); // Set a high depth value

        this.pauseText = this.add
            .text(centerPauseX, centerPauseY, "Game Paused", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false)
            .setInteractive()
            .on("pointerdown", () => {
                this.resumeGame();
                EventBus.emit("resumeGame");
            });
        this.pauseText.setDepth(10); // Set a high depth value
    }

    updatePopupText(text) {
        this.popupText.setText(text);
        this.popupBackground.setVisible(true);
        this.popupText.setVisible(true);
    }

    hidePopupText() {
        this.popupBackground.setVisible(false);
        this.popupText.setVisible(false);
    }

    muteGame() {
        this.sound.mute = !this.sound.mute;
    }

    pauseGame() {
        this.scene.pause();
        this.sparIntro.pause();
        this.sparLoop.pause();
        this.isGamePaused = true;
        this.pauseBackground.setVisible(true);
        this.pauseText.setVisible(true);
    }

    resumeGame() {
        this.scene.resume();
        this.sparIntro.resume();
        this.sparLoop.resume();
        this.isGamePaused = false;
        this.pauseBackground.setVisible(false);
        this.pauseText.setVisible(false);
    }

    addLeftFighter() {
        this.sparIntro.play();
        if (this.hero && this.hero.sprite) {
            this.hero.sprite
                .setPosition(this.cameras.main.width * 0.25, this.cameras.main.height * 0.625)
                .setVisible(true)
                .setOrigin(0.5)
                .setDepth(13);
            console.log('Hero sprite set in Spar:', this.hero.sprite); // Debugging line
        }
    }

    addVsText() {
        this.vsText = this.add
            .text(
                this.cameras.main.width * 0.5,
                this.cameras.main.height * 0.5,
                "VS",
                {
                    fontFamily: "Arial Black",
                    fontSize: 64,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                }
            )
            .setOrigin(0.5);
    }

    addRightFighter() {
        if (this.enemy && this.enemy.sprite) {
            this.enemy.sprite
                .setPosition(this.cameras.main.width * 0.75, this.cameras.main.height * 0.625)
                .setVisible(true)
                .setOrigin(0.5)
                .setDepth(13);

            console.log('Enemy sprite set in Spar:', this.enemy.sprite); // Debugging line
        }
    }

    updateBackgroundAndText() {
        if (this.vsText) {
            this.vsText.setText("FIGHT");
        }
        this.sparLoop.play();
    }

    showStatsAndRemoveFight() {
        this.add.image(512, 384, "gym").setDepth(-1); // Initial background
        if (this.vsText) {
            this.vsText.destroy();
        }
        this.heroHealthText.setVisible(true);
        this.heroPowerBoost.setVisible(true);
        this.heroStaminaText.setVisible(true);
        this.heroSwiftnessBoost.setVisible(true);
        this.enemyHealthText.setVisible(true);
        this.enemyPowerBoost.setVisible(true);
        this.enemyStaminaText.setVisible(true);
        this.enemySwiftnessBoost.setVisible(true);

        this.events.emit("showRoundCounter");

        this.fightStateMachine = new FightRoundsStateMachine(this);
        this.fightStateMachine.start();

        this.isInitialized = true;
        EventBus.emit("fightStateMachineInitialized");
    }

    update() {
        if (this.isInitialized) {
            this.fightStateMachine.update();
        }
        this.updateTextElements();
    }

    updateStatsUi(x) {
        // Hero
        this.hero.currentHealth = x.hero.currentHealth;
        this.hero.totalHealth = x.hero.totalHealth;
        this.hero.currentStamina = x.hero.currentStamina;
        this.hero.totalStamina = x.hero.totalStamina;
        // Enemy
        this.enemy.currentHealth = x.enemy.currentHealth;
        this.enemy.totalHealth = x.enemy.totalHealth;
        this.enemy.currentStamina = x.enemy.currentStamina;
        this.enemy.totalStamina = x.enemy.totalStamina;
    }

    updateTextElements() {
        this.heroHealthText.setText(
            `Hero Health: ${this.hero.currentHealth} / ${this.hero.totalHealth}`
        );

        this.heroPowerBoost.setText(
            `Power Boost: ${((this.hero.powerBoost - 1) * 100).toFixed(0)}%`
        );
        this.heroStaminaText.setText(
            `Hero Stamina: ${this.hero.currentStamina} / ${this.hero.totalStamina}`
        );
        this.heroSwiftnessBoost.setText(
            `Swiftness Boost: +${((this.hero.swiftnessBoost - 1) * 100).toFixed(
                0
            )}%`
        );
        this.enemyHealthText.setText(
            `Enemy Health: ${this.enemy.currentHealth} / ${this.enemy.totalHealth}`
        );
        this.enemyPowerBoost.setText(
            `Power Boost: ${((this.enemy.powerBoost - 1) * 100).toFixed(0)}%`
        );
        this.enemyStaminaText.setText(
            `Enemy Stamina: ${this.enemy.currentStamina} / ${this.enemy.totalStamina}`
        );
        this.enemySwiftnessBoost.setText(
            `Swiftness Boost: +${(
                (this.enemy.swiftnessBoost - 1) *
                100
            ).toFixed(0)}%`
        );
    }

    heroAction(action) {
        switch (action) {
            case "punch":
                this.heroCombatActions.punch(() => {
                    this.events.emit("heroActionComplete");
                });
                break;
            case "kick":
                this.heroCombatActions.kick(() => {
                    this.events.emit("heroActionComplete");
                });
                break;
            case "special":
                this.heroCombatActions.special(() => {
                    this.events.emit("heroActionComplete");
                });
                break;
            case "guard":
                this.heroCombatActions.guard(() => {
                    this.events.emit("heroActionComplete");
                });
                break;
            default:
                console.log("Unknown action:", action);
        }
        this.heroTotalDamageBlocked = this.hero.damageBlocked;
    }

    enemyAction() {
        this.updatePopupText(`${this.enemy.name} considers his options...`);
        EventBus.emit("enemyTurn");
        setTimeout(() => {
            const actions = ["punch", "kick", "guard"];
            let action;

            do {
                action = actions[Math.floor(Math.random() * actions.length)];
            } while (
                (action === "punch" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.punch
                            .requiredStamina) ||
                (action === "kick" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.kick
                            .requiredStamina) ||
                (action === "guard" &&
                    !(
                        this.enemy.currentHealth <
                            this.enemy.totalHealth * 0.5 ||
                        this.enemy.currentStamina <
                            this.enemy.totalStamina * 0.5
                    ))
            );

            const onComplete = () => {
                this.enemyTotalDamageBlocked = this.enemy.damageBlocked;
                this.events.emit("enemyActionComplete");
            };

            switch (action) {
                case "punch":
                    this.enemyCombatActions.punch(onComplete);
                    break;
                case "kick":
                    this.enemyCombatActions.kick(onComplete);
                    break;
                case "special":
                    this.enemyCombatActions.special(onComplete);
                    break;
                case "guard":
                    this.enemyCombatActions.guard(onComplete);
                    break;
                default:
                    console.log("Unknown action:", action);
            }
        }, 1000);
    }

    changePostFightScene({ tie, winner }) {
        this.scene.start("PostFight", {
            heroTotalDamageCaused: this.heroTotalDamageCaused,
            heroTotalDamageBlocked: this.heroTotalDamageBlocked,
            enemyTotalDamageCaused: this.enemyTotalDamageCaused,
            enemyTotalDamageBlocked: this.enemyTotalDamageBlocked,
            tie: tie,
            winner: winner,
        });
    }
}

