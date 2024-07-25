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
        this.notificationText = null;
    }

    init(data) {
        this.selectedCharacter = this.registry.get("selectedCharacter");

        // Ensure correct assignment
        this.hero =
            this.selectedCharacter === this.registry.get("hero")
                ? this.registry.get("hero")
                : this.registry.get("enemy");
        this.enemy =
            this.selectedCharacter === this.registry.get("hero")
                ? this.registry.get("enemy")
                : this.registry.get("hero");

        this.heroCombatActions = new CombatActions(this.hero, this.enemy, this);
        this.enemyCombatActions = new CombatActions(
            this.enemy,
            this.hero,
            this
        );

        // Ensure hero and enemy stats are separate and accurate
        this.hero.currentHealth = this.hero.totalHealth;
        this.hero.currentStamina = this.hero.totalStamina;
        this.enemy.currentHealth = this.enemy.totalHealth;
        this.enemy.currentStamina = this.enemy.totalStamina;
    }

    create() {
        // Initialize hero and enemy sprites
        this.hero.sprite = this.add.image(100, 100, 'heroSprite').setVisible(true);
        this.enemy.sprite = this.add.image(500, 100, 'enemySprite').setVisible(true);
        
        // Ensure sprites are correctly positioned and visible
        if (this.selectedCharacter === this.hero) {
            this.hero.sprite.setFlipX(false);  // Face right
            this.enemy.sprite.setFlipX(true);  // Face left
        } else {
            this.hero.sprite.setFlipX(true);   // Face left
            this.enemy.sprite.setFlipX(false); // Face right
        }
    
        // Initialize health and stamina bars
        this.heroHealthBar = this.add.graphics();
        this.heroStaminaBar = this.add.graphics();
        this.enemyHealthBar = this.add.graphics();
        this.enemyStaminaBar = this.add.graphics();
    
        // Call updateBars after initializing graphics
        this.updateBars();
        this.updateTextElements();
    
        // Initialize notification text
        const notificationStyle = {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            fontStyle: 'italic',
            color: '#ffffff',
            align: 'right',
        };
    
        this.notificationText = this.add.text(
            this.cameras.main.width - 10, // Offset by 10 pixels from the right edge
            this.cameras.main.height - 10, // Offset by 10 pixels from the bottom edge
            "", 
            notificationStyle
        )
        .setOrigin(1, 1) // Set origin to the bottom right corner
        .setVisible(false)
        .setDepth(100); // Increased depth for visibility
    
        console.log('Notification text created:', this.notificationText); // Debugging log
        
        // Event listeners for showing notifications
        EventBus.on("gameStateSaved", () => {
            console.log('gameStateSaved event triggered'); // Debugging log
            this.showNotification("GAME STATE SAVED");
        });
        EventBus.on("gameStateLoaded", () => {
            console.log('gameStateLoaded event triggered'); // Debugging log
            this.showNotification("GAME STATE LOADED");
        });
    
        // Initialize sounds
        this.sparIntro = this.sound.add("sparIntro", { loop: false, volume: 0.5 });
        this.sparLoop = this.sound.add("sparLoop", { loop: true, volume: 0.5 });
    
        // Define volume levels
        const VOLUME_LEVELS = { SOFT: 0.5, NORMAL: 1, LOUD: 1.5 };
    
        // Load sounds with specified volume levels
        this.punch1 = this.sound.add("punch1", { loop: false, volume: VOLUME_LEVELS.SOFT });
        // Additional punch sounds...
        this.massivePunch = this.sound.add("massivePunch", { loop: false, volume: VOLUME_LEVELS.NORMAL });
    
        this.kick1 = this.sound.add("kick1", { loop: false, volume: VOLUME_LEVELS.SOFT });
        // Additional kick sounds...
        this.massiveKick = this.sound.add("massiveKick", { loop: false, volume: VOLUME_LEVELS.NORMAL });
    
        this.special = this.sound.add("special", { loop: false, volume: VOLUME_LEVELS.LOUD });
        
        EventBus.on("muteGame", this.muteGame, this);
        EventBus.on("pauseGame", this.pauseGame, this);
        EventBus.on("resumeGame", this.resumeGame, this);
    
        // Initialize punch and special sprites (ensure to preload these assets in preload())
        this.punchSprite = this.add.sprite(400, 300, 'punchReg').setVisible(false);
        this.specialSprite = this.add.sprite(600, 100, 'special').setVisible(false);
    
        // Add characters and text with appropriate delays
        this.time.delayedCall(750, this.addLeftFighter, [], this);
        this.time.delayedCall(2300, this.addVsText, [], this);
        this.time.delayedCall(2850, this.addRightFighter, [], this);
        this.time.delayedCall(5100, this.updateBackgroundAndText, [], this);
        this.time.delayedCall(6650, this.showStatsAndRemoveFight, [], this);
    
        // Add hero and enemy stats text, initially hidden
        this.heroHealthText = this.add.text(16, 16, "", { fontSize: "32px", fill: "white" }).setVisible(false);
        this.heroPowerBoost = this.add.text(16, 48, "", { fontSize: "32px", fill: "white" }).setVisible(false);
        this.heroStaminaText = this.add.text(16, 80, "", { fontSize: "32px", fill: "white" }).setVisible(false);
        this.heroSwiftnessBoost = this.add.text(16, 112, "", { fontSize: "32px", fill: "white" }).setVisible(false);
        this.enemyHealthText = this.add.text(550, 16, "", { fontSize: "32px", fill: "white" }).setVisible(false);
        this.enemyPowerBoost = this.add.text(550, 48, "", { fontSize: "32px", fill: "white" }).setVisible(false);
        this.enemyStaminaText = this.add.text(550, 80, "", { fontSize: "32px", fill: "white" }).setVisible(false);
        this.enemySwiftnessBoost = this.add.text(550, 112, "", { fontSize: "32px", fill: "white" }).setVisible(false);
    
        // Event listeners for combat actions
        this.events.on("punch", this.heroCombatActions.punch.bind(this.heroCombatActions));
        this.events.on("kick", this.heroCombatActions.kick.bind(this.heroCombatActions));
        this.events.on("special", this.heroCombatActions.special.bind(this.heroCombatActions));
        this.events.on("guard", this.heroCombatActions.guard.bind(this.heroCombatActions));
    
        this.events.on("heroGo", () => {
            EventBus.emit("playerTurn");
            this.updatePopupText(`${this.hero.name} considers \nhis options ...\n\nCHOOSE AN ACTION\nBELOW!`);
            EventBus.emit("enablePlayerButtons");
        }, this);
    
        this.events.on("enemyGo", this.enemyAction, this);
    
        this.events.on("fightEnded", this.changePostFightScene, this);
    
        EventBus.on("playerAction", this.heroAction.bind(this));
    
        EventBus.on('goToNextScene', () => {
            this.scene.start('PostFight');
        });
    
        EventBus.on('goToPreviousScene', () => {
            this.scene.start('CharacterSelectionScene');
        });
    
        EventBus.emit("current-scene-ready", this);
    
        EventBus.on("updateUi", (x) => {
            return this.updateStatsUi(x);
        });
    
        // Add round counter text, initially hidden
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 8;
    
        this.roundText = this.add.text(centerX, centerY + 27, "8", {
            fontFamily: "Arial Black",
            fontSize: 48,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 7,
            align: "center",
        }).setOrigin(0.5).setVisible(false);
    
        this.roundLabel = this.add.text(centerX, centerY - 55, "ROUNDS", {
            fontFamily: "Arial Black",
            fontSize: 32,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 7,
            align: "center",
        }).setOrigin(0.5).setVisible(false);
    
        this.roundLeft = this.add.text(centerX, centerY - 20, "LEFT", {
            fontFamily: "Arial Black",
            fontSize: 32,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 7,
            align: "center",
        }).setOrigin(0.5).setVisible(false);
    
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
        this.pauseBackground.setDepth(14); // Set a high depth value
    
        this.pauseText = this.add.text(centerPauseX, centerPauseY, "Game Paused", {
            fontFamily: "Arial Black",
            fontSize: 32,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6,
            align: "center",
        }).setOrigin(0.5).setVisible(false).setInteractive()
        .on("pointerdown", () => {
            this.resumeGame();
            EventBus.emit("resumeGame");
        });
        this.pauseText.setDepth(15); // Set a high depth value

        const popupStyle = {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            fontStyle: 'italic',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 300, useAdvancedWrap: true }
        };
    
        this.popupText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "",
            popupStyle
        )
        .setOrigin(0.5)
        .setVisible(false)
        .setDepth(10); // Ensure it is above other elements
    
        // Debugging log to confirm initialization
        console.log('Popup text initialized:', this.popupText);
    
        // Other code...
    }

    updatePopupText(text) {
        if (!this.popupText) {
            console.error("Popup text is not initialized.");
            return;
        }
    
        this.popupText.setText(text);
        this.popupText.setVisible(true);
        console.log("Popup text updated:", this.popupText.text); // Debugging log
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

    showNotification(message) {
        console.log("Displaying notification:", message); // Debugging log
        this.notificationText.setText(message);
        this.notificationText.setVisible(true);

        console.log("Notification text:", this.notificationText); // Debugging log

        this.time.delayedCall(3000, () => {
            this.notificationText.setVisible(false);
            console.log("Notification hidden"); // Debugging log
        });
    }

    addLeftFighter() {
        this.sparIntro.play();
        this.punchSprite.play("punchReg");

        if (this.hero && this.hero.sprite) {
            this.hero.sprite
                .setPosition(
                    this.cameras.main.width * 0.25,
                    this.cameras.main.height * 0.625
                )
                .setVisible(true)
                .setOrigin(0.5)
                .setDepth(13);
            console.log("Hero sprite set in Spar:", this.hero.sprite); // Debugging line
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
                .setPosition(
                    this.cameras.main.width * 0.75,
                    this.cameras.main.height * 0.625
                )
                .setVisible(true)
                .setOrigin(0.5)
                .setDepth(13);

            console.log("Enemy sprite set in Spar:", this.enemy.sprite); // Debugging line
        }
    }

    updateBackgroundAndText() {
        if (this.vsText) {
            this.vsText.setText("FIGHT!");
        }
        this.sparLoop.play();
    }

    showStatsAndRemoveFight() {
        this.add.image(512, 384, "gym").setDepth(-1); // Initial background
        if (this.vsText) {
            this.vsText.destroy();
        }

        // Set the visibility of hero stats
        this.heroHealthText.setVisible(true);
        this.heroPowerBoost.setVisible(true);
        this.heroStaminaText.setVisible(true);
        this.heroSwiftnessBoost.setVisible(true);

        // Set the visibility of enemy stats
        this.enemyHealthText.setVisible(true);
        this.enemyPowerBoost.setVisible(true);
        this.enemyStaminaText.setVisible(true);
        this.enemySwiftnessBoost.setVisible(true);

        // Set the visibility of health and stamina bars
        this.heroHealthBar.setVisible(true);
        this.heroStaminaBar.setVisible(true);
        this.enemyHealthBar.setVisible(true);
        this.enemyStaminaBar.setVisible(true);

        this.events.emit("showRoundCounter");

        this.fightStateMachine = new FightRoundsStateMachine(this);
        this.fightStateMachine.start();

        this.isInitialized = true;
        EventBus.emit("fightStateMachineInitialized");
    }

    updateBars() {
        const barWidth = 375;
        const barHeight = 30;
        const borderColor = 0x000000;
        const borderThickness = 3;
        const backgroundColor = 0x000000;

        const healthColor = 0x004d00;
        const staminaColor = 0x4da6ff;

        const offsetX = 32;
        const offsetY = 32;

        const heroHealthX = offsetX;
        const heroHealthY = offsetY;
        const heroStaminaY = heroHealthY + 62.5;

        const enemyHealthX = this.cameras.main.width - barWidth - offsetX;
        const enemyHealthY = heroHealthY;
        const enemyStaminaY = heroStaminaY;

        // Update hero health bar
        this.heroHealthBar
            .clear()
            .lineStyle(borderThickness, borderColor)
            .fillStyle(backgroundColor, 0.9)
            .fillRect(heroHealthX, heroHealthY, barWidth, barHeight)
            .strokeRect(heroHealthX, heroHealthY, barWidth, barHeight)
            .fillStyle(healthColor)
            .fillRect(
                heroHealthX,
                heroHealthY,
                (this.hero.currentHealth / this.hero.totalHealth) * barWidth,
                barHeight
            );

        // Update hero stamina bar
        this.heroStaminaBar
            .clear()
            .lineStyle(borderThickness, borderColor)
            .fillStyle(backgroundColor, 0.9)
            .fillRect(heroHealthX, heroStaminaY, barWidth, barHeight)
            .strokeRect(heroHealthX, heroStaminaY, barWidth, barHeight)
            .fillStyle(staminaColor)
            .fillRect(
                heroHealthX,
                heroStaminaY,
                (this.hero.currentStamina / this.hero.totalStamina) * barWidth,
                barHeight
            );

        // Update enemy health bar
        this.enemyHealthBar
            .clear()
            .lineStyle(borderThickness, borderColor)
            .fillStyle(backgroundColor, 0.9)
            .fillRect(enemyHealthX, enemyHealthY, barWidth, barHeight)
            .strokeRect(enemyHealthX, enemyHealthY, barWidth, barHeight)
            .fillStyle(healthColor)
            .fillRect(
                enemyHealthX,
                enemyHealthY,
                (this.enemy.currentHealth / this.enemy.totalHealth) * barWidth,
                barHeight
            );

        // Update enemy stamina bar
        this.enemyStaminaBar
            .clear()
            .lineStyle(borderThickness, borderColor)
            .fillStyle(backgroundColor, 0.9)
            .fillRect(enemyHealthX, enemyStaminaY, barWidth, barHeight)
            .strokeRect(enemyHealthX, enemyStaminaY, barWidth, barHeight)
            .fillStyle(staminaColor)
            .fillRect(
                enemyHealthX,
                enemyStaminaY,
                (this.enemy.currentStamina / this.enemy.totalStamina) *
                    barWidth,
                barHeight
            );
    }

    update() {
        if (this.isInitialized && this.fightStateMachine) {
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

        // Update bars
        this.updateBars();

        // Debugging logs to check round number and rounds left
        console.log("Current round number:", x.roundNumber);
        const roundsLeft = 11 - x.roundNumber; // Assuming 11 total rounds
        console.log("Rounds left:", roundsLeft);

        // Update the round number display
        this.roundText.setText(`${roundsLeft}`);
        this.roundText.setVisible(true); // Ensure visibility if hidden
        this.roundLabel.setVisible(true);
        this.roundLeft.setVisible(true);
    }
    updateTextElements() {
        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: "20px", // 25% smaller than 26px
            color: "#ffffff",
            stroke: "#000000", // Black stroke around the text
            strokeThickness: 3, // Thickness of the stroke
        };

        const labelOffsetX = 33; // Label position from the left
        const valueOffsetX = 410; // Value position from the left
        const offsetY = 64; // Position from the top
        const spacingY = 62; // Vertical spacing between lines

        // Hero text positions
        const heroHealthTextX = labelOffsetX;
        const heroHealthValueX = valueOffsetX;
        const heroHealthTextY = offsetY;
        const heroStaminaTextY = heroHealthTextY + spacingY;

        // Enemy text positions (mirrored on the right side)
        const enemyLabelOffsetX = this.cameras.main.width - labelOffsetX;
        const enemyValueOffsetX = this.cameras.main.width - valueOffsetX;
        const enemyHealthTextY = heroHealthTextY;
        const enemyStaminaTextY = heroStaminaTextY;

        // Check if text objects already exist, if not, create them
        if (!this.heroHealthValueText) {
            this.heroHealthText = this.add
                .text(heroHealthTextX, heroHealthTextY, `HEALTH`, textStyle)
                .setOrigin(0, 0)
                .setVisible(false);
            this.heroHealthValueText = this.add
                .text(
                    heroHealthValueX,
                    heroHealthTextY,
                    `${this.hero.currentHealth} / ${this.hero.totalHealth}`,
                    { ...textStyle, align: "right" }
                )
                .setOrigin(1, 0)
                .setVisible(false);

            this.heroStaminaText = this.add
                .text(heroHealthTextX, heroStaminaTextY, `STAMINA`, textStyle)
                .setOrigin(0, 0)
                .setVisible(false);
            this.heroStaminaValueText = this.add
                .text(
                    heroHealthValueX,
                    heroStaminaTextY,
                    `${this.hero.currentStamina} / ${this.hero.totalStamina}`,
                    { ...textStyle, align: "right" }
                )
                .setOrigin(1, 0)
                .setVisible(false);

            this.enemyHealthText = this.add
                .text(enemyLabelOffsetX, enemyHealthTextY, `HEALTH`, textStyle)
                .setOrigin(1, 0)
                .setVisible(false);
            this.enemyHealthValueText = this.add
                .text(
                    enemyValueOffsetX,
                    enemyHealthTextY,
                    `${this.enemy.currentHealth} / ${this.enemy.totalHealth}`,
                    { ...textStyle, align: "left" }
                )
                .setOrigin(0, 0)
                .setVisible(false);

            this.enemyStaminaText = this.add
                .text(
                    enemyLabelOffsetX,
                    enemyStaminaTextY,
                    `STAMINA`,
                    textStyle
                )
                .setOrigin(1, 0)
                .setVisible(false);
            this.enemyStaminaValueText = this.add
                .text(
                    enemyValueOffsetX,
                    enemyStaminaTextY,
                    `${this.enemy.currentStamina} / ${this.enemy.totalStamina}`,
                    { ...textStyle, align: "left" }
                )
                .setOrigin(0, 0)
                .setVisible(false);
        }

        // Update text values
        this.heroHealthValueText.setText(
            `${this.hero.currentHealth} / ${this.hero.totalHealth}`
        );
        this.heroStaminaValueText.setText(
            `${this.hero.currentStamina} / ${this.hero.totalStamina}`
        );
        this.enemyHealthValueText.setText(
            `${this.enemy.currentHealth} / ${this.enemy.totalHealth}`
        );
        this.enemyStaminaValueText.setText(
            `${this.enemy.currentStamina} / ${this.enemy.totalStamina}`
        );

        // Show the text elements if they should be visible
        if (this.isInitialized) {
            this.heroHealthText.setVisible(true);
            this.heroHealthValueText.setVisible(true);
            this.heroStaminaText.setVisible(true);
            this.heroStaminaValueText.setVisible(true);
            this.enemyHealthText.setVisible(true);
            this.enemyHealthValueText.setVisible(true);
            this.enemyStaminaText.setVisible(true);
            this.enemyStaminaValueText.setVisible(true);
        } else {
            this.heroHealthText.setVisible(false);
            this.heroHealthValueText.setVisible(false);
            this.heroStaminaText.setVisible(false);
            this.heroStaminaValueText.setVisible(false);
            this.enemyHealthText.setVisible(false);
            this.enemyHealthValueText.setVisible(false);
            this.enemyStaminaText.setVisible(false);
            this.enemyStaminaValueText.setVisible(false);
        }
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
        this.updatePopupText(`${this.enemy.name} considers \nhis options ...`);
        EventBus.emit("enemyTurn");
        setTimeout(() => {
            const actions = ["punch", "kick", "special", "guard"]; // Added "special" here
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
                (action === "special" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.special
                            .requiredStamina) || // Check stamina for "special"
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
                case "special": // Handling special attack
                    this.enemyCombatActions.special(onComplete);
                    break;
                case "guard":
                    this.enemyCombatActions.guard(onComplete);
                    break;
                default:
                    console.log("Unknown action:", action);
            }
        }, 2000);
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

