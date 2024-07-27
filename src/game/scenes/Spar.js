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
        this.notificationText = null; // Add this line to declare notificationText
    }

    init(data) {
        this.hero = this.registry.get("hero");
        this.enemy = this.registry.get("enemy");
        this.heroCombatActions = new CombatActions(this.hero, this.enemy, this);
        this.enemyCombatActions = new CombatActions(
            this.enemy,
            this.hero,
            this
        );

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
            this.updateBars();
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
            this.updateBars();
        };

        this.hero.updateStamina = (amount) => {
            this.hero.currentStamina += amount;
            if (this.hero.currentStamina > this.hero.totalStamina) {
                this.hero.currentStamina = this.hero.totalStamina;
            } else if (this.hero.currentStamina < 0) {
                this.hero.currentStamina = 0;
            }
            this.updateBars();
        };

        this.enemy.updateStamina = (amount) => {
            this.enemy.currentStamina += amount;
            if (this.enemy.currentStamina > this.enemy.totalStamina) {
                this.enemy.currentStamina = this.enemy.totalStamina;
            } else if (this.enemy.currentStamina < 0) {
                this.enemy.currentStamina = 0;
            }
            this.updateBars();
        };
    }

    create() {
        const notificationStyle = {
            fontFamily: "Arial Black",
            fontSize: "24px",
            fontStyle: "italic",
            color: "#ffffff",
            align: "right",
        };

        this.notificationText = this.add
            .text(
                this.cameras.main.width - 10, // Offset by 10 pixels from the right edge
                this.cameras.main.height - 10, // Offset by 10 pixels from the bottom edge
                "",
                notificationStyle
            )
            .setOrigin(1, 1) // Set origin to the bottom right corner
            .setVisible(false)
            .setDepth(100); // Increased depth for visibility

        console.log("Notification text created:", this.notificationText); // Debugging log

        // Event listeners for showing notification
        EventBus.on("gameStateSaved", () => {
            console.log("gameStateSaved event triggered"); // Debugging log
            this.showNotification("GAME STATE SAVED");
        });
        EventBus.on("gameStateLoaded", () => {
            console.log("gameStateLoaded event triggered"); // Debugging log
            this.showNotification("GAME STATE LOADED");
        });

        // Initialize hero and enemy sprites
        this.hero.sprite = this.add
            .image(100, 100, "heroSprite")
            .setVisible(false);
        this.enemy.sprite = this.add
            .image(500, 100, "enemySprite")
            .setVisible(false);
        this.punchSprite = this.add
            .sprite(400, 300, "punchReg")
            .setVisible(false);
        this.specialSprite = this.add
            .sprite(600, 100, "special")
            .setVisible(false);

        this.heroHealthBar = this.add.graphics().setVisible(false);
        this.heroStaminaBar = this.add.graphics().setVisible(false);
        this.enemyHealthBar = this.add.graphics().setVisible(false);
        this.enemyStaminaBar = this.add.graphics().setVisible(false);

        this.updateBars();

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
                wordWrap: { width: 300, useAdvancedWrap: true },
            })
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(13);

        this.sparIntro = this.sound.add("sparIntro", {
            loop: false,
            volume: 0.5,
        });
        this.sparLoop = this.sound.add("sparLoop", {
            loop: true,
            volume: 0.5,
        });

        const VOLUME_LEVELS = {
            SOFT: 0.5,
            NORMAL: 1,
            LOUD: 1.5,
        };

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

        this.time.delayedCall(750, this.addLeftFighter, [], this);
        this.time.delayedCall(2300, this.addVsText, [], this);
        this.time.delayedCall(2850, this.addRightFighter, [], this);
        this.time.delayedCall(5100, this.updateBackgroundAndText, [], this);
        this.time.delayedCall(6650, this.showStatsAndRemoveFight, [], this);

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
                    `${this.hero.name} considers \nhis options ...\n\nCHOOSE AN ACTION\nBELOW!`
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

        EventBus.on("goToNextScene", () => {
            this.scene.start("PostFight");
        });

        EventBus.on("goToPreviousScene", () => {
            this.scene.start("CharacterSelectionScene");
        });

        EventBus.emit("current-scene-ready", this);

        EventBus.on("updateUi", (x) => {
            return this.updateStatsUi(x);
        });

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 8;

        this.roundText = this.add
            .text(centerX, centerY + 27, "10", {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 7,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false);

        this.roundLabel = this.add
            .text(centerX, centerY - 55, "ROUNDS", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 7,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false);

        this.roundLeft = this.add
            .text(centerX, centerY - 20, "LEFT", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 7,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false);

        this.events.on("showRoundCounter", () => {
            this.roundText.setVisible(true);
            this.roundLabel.setVisible(true);
            this.roundLeft.setVisible(true);
        });

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
        this.pauseBackground.setDepth(14);

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
        this.pauseText.setDepth(15);
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

    showNotification(message) {
        console.log("Displaying notification:", message);
        this.notificationText.setText(message);
        this.notificationText.setVisible(true);

        console.log("Notification text:", this.notificationText); // Debugging log

        this.time.delayedCall(3000, () => {
            this.notificationText.setVisible(false);
            console.log("Notification hidden");
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
        this.add.image(512, 384, "gym").setDepth(-1);
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
        const barWidth = 375; // 25% wider than 300
        const barHeight = 30; // 50% taller than 20
        const borderColor = 0x000000; // Black border color
        const borderThickness = 3; // Thickness of the border
        const backgroundColor = 0x000000; // Very dark, almost black background for empty bars

        // Subdued colors for the bars
        const healthColor = 0x004d00; // Dark green for health
        const staminaColor = 0x4da6ff; // Light blue for stamina

        // Positions for hero bars (doubled distance from top and sides)
        const offsetX = 32; // Twice the original 16
        const offsetY = 32; // Twice thœe original 16

        const heroHealthX = offsetX;
        const heroHealthY = offsetY;
        const heroStaminaY = heroHealthY + 62.5; // 50px below the health bar

        // Positions for enemy bars (mirrored)
        const enemyHealthX = this.cameras.main.width - barWidth - offsetX; // Align with the right side
        const enemyHealthY = heroHealthY;
        const enemyStaminaY = heroStaminaY;

        // Update hero health bar smoothly
        this.tweens.add({
            targets: this.heroHealthBar,
            fillRectWidth:
                (this.hero.currentHealth / this.hero.totalHealth) * barWidth,
            duration: 500,
            onUpdate: (tween) => {
                const width = tween.getValue();
                this.heroHealthBar.clear();
                this.heroHealthBar.lineStyle(borderThickness, borderColor);
                this.heroHealthBar.fillStyle(backgroundColor, 0.9); // Nearly opaque background
                this.heroHealthBar.fillRect(
                    heroHealthX,
                    heroHealthY,
                    barWidth,
                    barHeight
                ); // Background rectangle
                this.heroHealthBar.strokeRect(
                    heroHealthX,
                    heroHealthY,
                    barWidth,
                    barHeight
                ); // Border rectangle
                this.heroHealthBar.fillStyle(healthColor);
                this.heroHealthBar.fillRect(
                    heroHealthX,
                    heroHealthY,
                    width,
                    barHeight
                );
            },
        });

        // Update hero stamina bar smoothly
        this.tweens.add({
            targets: this.heroStaminaBar,
            fillRectWidth:
                (this.hero.currentStamina / this.hero.totalStamina) * barWidth,
            duration: 500,
            onUpdate: (tween) => {
                const width = tween.getValue();
                this.heroStaminaBar.clear();
                this.heroStaminaBar.lineStyle(borderThickness, borderColor);
                this.heroStaminaBar.fillStyle(backgroundColor, 0.9); // Nearly opaque background
                this.heroStaminaBar.fillRect(
                    heroHealthX,
                    heroStaminaY,
                    barWidth,
                    barHeight
                ); // Background rectangle
                this.heroStaminaBar.strokeRect(
                    heroHealthX,
                    heroStaminaY,
                    barWidth,
                    barHeight
                ); // Border rectangle
                this.heroStaminaBar.fillStyle(staminaColor);
                this.heroStaminaBar.fillRect(
                    heroHealthX,
                    heroStaminaY,
                    width,
                    barHeight
                );
            },
        });

        // Update enemy health bar smoothly
        this.tweens.add({
            targets: this.enemyHealthBar,
            fillRectWidth:
                barWidth -
                (this.enemy.currentHealth / this.enemy.totalHealth) * barWidth,
            duration: 500,
            onUpdate: (tween) => {
                const width = tween.getValue();
                this.enemyHealthBar.clear();
                this.enemyHealthBar.lineStyle(borderThickness, borderColor);
                this.enemyHealthBar.fillStyle(backgroundColor, 0.9); // Nearly opaque background
                this.enemyHealthBar.fillRect(
                    enemyHealthX,
                    enemyHealthY,
                    barWidth,
                    barHeight
                ); // Background rectangle
                this.enemyHealthBar.strokeRect(
                    enemyHealthX,
                    enemyHealthY,
                    barWidth,
                    barHeight
                ); // Border rectangle
                this.enemyHealthBar.fillStyle(healthColor);
                this.enemyHealthBar.fillRect(
                    enemyHealthX + width,
                    enemyHealthY,
                    barWidth - width,
                    barHeight
                );
            },
        });

        // Update enemy stamina bar smoothly
        this.tweens.add({
            targets: this.enemyStaminaBar,
            fillRectWidth:
                barWidth -
                (this.enemy.currentStamina / this.enemy.totalStamina) *
                    barWidth,
            duration: 500,
            onUpdate: (tween) => {
                const width = tween.getValue();
                this.enemyStaminaBar.clear();
                this.enemyStaminaBar.lineStyle(borderThickness, borderColor);
                this.enemyStaminaBar.fillStyle(backgroundColor, 0.9); // Nearly opaque background
                this.enemyStaminaBar.fillRect(
                    enemyHealthX,
                    enemyStaminaY,
                    barWidth,
                    barHeight
                ); // Background rectangle
                this.enemyStaminaBar.strokeRect(
                    enemyHealthX,
                    enemyStaminaY,
                    barWidth,
                    barHeight
                ); // Border rectangle
                this.enemyStaminaBar.fillStyle(staminaColor);
                this.enemyStaminaBar.fillRect(
                    enemyHealthX + width,
                    enemyStaminaY,
                    barWidth - width,
                    barHeight
                );
            },
        });
    }

    update() {
        if (this.isInitialized) {
            this.fightStateMachine.update();
        }
        this.updateTextElements();
    }

    updateStatsUi(x) {
        this.hero.currentHealth = x.hero.currentHealth;
        this.hero.totalHealth = x.hero.totalHealth;
        this.hero.currentStamina = x.hero.currentStamina;
        this.hero.totalStamina = x.hero.totalStamina;

        this.enemy.currentHealth = x.enemy.currentHealth;
        this.enemy.totalHealth = x.enemy.totalHealth;
        this.enemy.currentStamina = x.enemy.currentStamina;
        this.enemy.totalStamina = x.enemy.totalStamina;

        this.updateBars();

        console.log("Current round number:", x.roundNumber);
        const roundsLeft = 10 - x.roundNumber;
        console.log("Rounds left:", roundsLeft);

        this.roundText.setText(`${roundsLeft}`);
        this.roundText.setVisible(true);
        this.roundLabel.setVisible(true);
        this.roundLeft.setVisible(true);
    }
    updateTextElements() {
        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: "20px",
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
        const enemyLabelOffsetX = this.cameras.main.width - labelOffsetX;
        const enemyValueOffsetX = this.cameras.main.width - valueOffsetX;
        const enemyHealthTextY = heroHealthTextY;
        const enemyStaminaTextY = heroStaminaTextY;
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
                    `${this.enemy.totalHealth} / ${this.enemy.currentHealth}`,
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
                    `${this.enemy.totalStamina} / ${this.enemy.totalStamina}`,
                    { ...textStyle, align: "left" }
                )
                .setOrigin(0, 0)
                .setVisible(false);
        }

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
        this.enemyTotalDamageBlocked += this.enemy.damageBlocked;
    }

    enemyAction() {
        this.updatePopupText(`${this.enemy.name} considers \nhis options ...`);
        EventBus.emit("enemyTurn");
        setTimeout(() => {
            const actions = ["punch", "kick", "guard"]; // Added "special" here
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
                // (action === "special" &&
                //     this.enemy.currentStamina <
                //         this.enemyCombatActions.attackTypes.special
                //             .requiredStamina) || // Check stamina for "special"
                (action === "guard" &&
                    !(
                        this.enemy.currentHealth <
                            this.enemy.totalHealth * 0.5 ||
                        this.enemy.currentStamina <
                            this.enemy.totalStamina * 0.5
                    ))
            );

            const onComplete = () => {
                this.heroTotalDamageBlocked += this.hero.damageBlocked;
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
        }, 2000);
    }

    changePostFightScene({ roundOut, knockOut }) {
        this.scene.start("PostFight", {
            heroTotalDamageCaused: this.heroTotalDamageCaused,
            heroTotalDamageBlocked: this.heroTotalDamageBlocked,
            enemyTotalDamageCaused: this.enemyTotalDamageCaused,
            enemyTotalDamageBlocked: this.enemyTotalDamageBlocked,
            roundOut: this.fightStateMachine,
            knockOut: this.fightStateMachine.knockOut,
        });
    }
}

