import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class PostFight extends Scene {
    constructor() {
        super("PostFight");
    }

    init(data) {
        this.heroTotalDamageCaused = data.heroTotalDamageCaused;
        this.heroTotalDamageBlocked = data.heroTotalDamageBlocked;
        this.enemyTotalDamageCaused = data.enemyTotalDamageCaused;
        this.enemyTotalDamageBlocked = data.enemyTotalDamageBlocked;
        this.roundOut = data.roundOut;
        this.knockOut = data.knockOut;
        console.log("PostFight init data:", data); // Debugging
    }

    create() {
        // Add background image
        this.add.image(512, 384, "background").setAlpha(0.7);
        EventBus.on("muteGame", this.muteGame, this);
        EventBus.on("pauseGame", this.pauseGame, this);
        EventBus.on("resumeGame", this.resumeGame, this);

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
        this.pauseText.setDepth(15); // Set a high depth value

        // Display "FIGHT OVER" title with animation
        this.time.delayedCall(750, () => {
            let fightEndText;
            if (this.knockOut) {
                fightEndText = `FIGHT OVER\nBY KO!`;
            } else if (this.roundOut) {
                this.winner = this.determineWinner();
                // fightEndText = "FIGHT OVER\nBY ROUNDS!";
                fightEndText = "FIGHT OVER!";
            } else {
                fightEndText = "FIGHT OVER!";
            }

            const fightOverText = this.add
                .text(512, 100, fightEndText, {
                    fontFamily: "Arial Black",
                    fontSize: 48,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 7,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Apply grow-and-shrink animation to the "FIGHT OVER" title
            this.tweens.add({
                targets: fightOverText,
                scaleX: 1.005,
                scaleY: 1.005,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Show Hero Stats Title and Background Box
        this.time.delayedCall(2250, () => {
            this.createHeroStatsBox();
            this.createHeroSprite();
            const heroStatsText = this.add
                .text(256, 450, "HERO STATS", {
                    fontFamily: "Arial Black",
                    fontSize: 32,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Apply grow-and-shrink animation to the hero stats title
            this.tweens.add({
                targets: heroStatsText,
                scaleX: 1.005,
                scaleY: 1.005,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Display Hero Stats
        this.time.delayedCall(3750, () => {
            this.add
                .text(
                    256,
                    513,
                    `TOTAL DAMAGE CAUSED:\n${this.heroTotalDamageCaused}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 20,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 5,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        this.time.delayedCall(4500, () => {
            this.add
                .text(
                    256,
                    587,
                    `TOTAL DAMAGE BLOCKED:\n${this.heroTotalDamageBlocked}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 20,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 5,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        this.time.delayedCall(5250, () => {
            const heroFinalScore =
                this.heroTotalDamageCaused + this.heroTotalDamageBlocked;

            this.add
                .text(256, 650, `FINAL SCORE: ${heroFinalScore}`, {
                    fontFamily: "Arial Black",
                    fontSize: 24,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);
        });

        // Show Enemy Stats Title and Background Box
        this.time.delayedCall(6750, () => {
            this.createEnemyStatsBox();
            this.createEnemySprite();
            const enemyStatsText = this.add
                .text(768, 450, "ENEMY STATS", {
                    fontFamily: "Arial Black",
                    fontSize: 32,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Apply grow-and-shrink animation to the enemy stats title
            this.tweens.add({
                targets: enemyStatsText,
                scaleX: 1.005,
                scaleY: 1.005,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Display Enemy Stats
        this.time.delayedCall(8250, () => {
            this.add
                .text(
                    768,
                    513,
                    `TOTAL DAMAGE CAUSED:\n${this.enemyTotalDamageCaused}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 20,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 5,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        this.time.delayedCall(9000, () => {
            this.add
                .text(
                    768,
                    587,
                    `TOTAL DAMAGE BLOCKED:\n${this.enemyTotalDamageBlocked}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 20,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 5,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        this.time.delayedCall(9750, () => {
            const enemyFinalScore =
                this.enemyTotalDamageCaused + this.enemyTotalDamageBlocked;

            this.add
                .text(768, 650, `FINAL SCORE: ${enemyFinalScore}`, {
                    fontFamily: "Arial Black",
                    fontSize: 24,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);
        });

        // Display Winner Announcement and Highlight
        this.time.delayedCall(11500, () => {
            let winnerText;
            if (this.winner && this.winner !== "tie") {
                winnerText = `WINNER: \n${this.winner.toUpperCase()}!`;
            } else {
                winnerText = `WINNER: \n${this.knockOut ? this.knockOut.toUpperCase() : 'NONE'}`;
            }

            const winnerTextObj = this.add
                .text(520, 450, winnerText, {
                    fontFamily: "Arial Black",
                    fontSize: 31,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Apply grow-and-shrink animation to the winner announcement
            this.tweens.add({
                targets: winnerTextObj,
                scaleX: 1.005,
                scaleY: 1.005,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Call highlightWinner() within the same delayed call
            this.highlightWinner();
        });

        EventBus.on("goToPreviousScene", () => {
            this.scene.start("Spar");
        });

        EventBus.emit("current-scene-ready", this);
    }

    createHeroStatsBox() {
        // Create Hero Stats Background Box
        this.heroStatsBg = this.add.graphics()
            .fillStyle(0x000000, 0.6)
            .fillRect(80, 200, 350, 500);

        // Apply grow-and-shrink animation to the hero stats background
        this.tweens.add({
            targets: this.heroStatsBg,
            scaleX: 1.005,
            scaleY: 1.005,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createHeroSprite() {
        // Define scaling factor
        const scaleFactor = 0.80; // Adjusted scale factor for larger sprites

        // Add Hero Sprite
        this.heroSprite = this.add.image(256, 255, 'heroSprite').setScale(scaleFactor).setDepth(150);
    }

    createEnemyStatsBox() {
        // Create Enemy Stats Background Box
        this.enemyStatsBg = this.add.graphics()
            .fillStyle(0x000000, 0.6)
            .fillRect(this.cameras.main.width - (80 + 350), 200, 350, 500);

        // Apply grow-and-shrink animation to the enemy stats background
        this.tweens.add({
            targets: this.enemyStatsBg,
            scaleX: 1.005,
            scaleY: 1.005,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createEnemySprite() {
        // Define scaling factor
        const scaleFactor = 0.80; // Adjusted scale factor for larger sprites

        // Add Enemy Sprite
        this.enemySprite = this.add.image(768, 255, 'enemySprite').setScale(scaleFactor).setDepth(150);
    }

    highlightWinner() {
        const heroScore = this.heroTotalDamageCaused + this.heroTotalDamageBlocked;
        const enemyScore = this.enemyTotalDamageCaused + this.enemyTotalDamageBlocked;

        if (this.winner === 'hero') {
            this.heroStatsBg.clear();
            this.heroStatsBg.fillStyle(0x1a1c42, 0.8).fillRect(80, 200, 350, 500); // Highlight hero
            this.enemyStatsBg.clear();
            this.enemyStatsBg.fillStyle(0x701010, 0.8).fillRect(this.cameras.main.width - (80 + 350), 200, 350, 500); // Red for enemy
        } else if (this.winner === 'enemy') {
            this.heroStatsBg.clear();
            this.heroStatsBg.fillStyle(0x701010, 0.8).fillRect(80, 200, 350, 500); // Red for hero
            this.enemyStatsBg.clear();
            this.enemyStatsBg.fillStyle(0x1a1c42, 0.8).fillRect(this.cameras.main.width - (80 + 350), 200, 350, 500); // Highlight enemy
        } else {
            this.heroStatsBg.clear();
            this.heroStatsBg.fillStyle(0x000000, 0.6).fillRect(80, 200, 350, 500); // Default hero
            this.enemyStatsBg.clear();
            this.enemyStatsBg.fillStyle(0x000000, 0.6).fillRect(this.cameras.main.width - (80 + 350), 200, 350, 500); // Default enemy
        }
    }

    determineWinner() {
        const heroScore = this.heroTotalDamageCaused + this.heroTotalDamageBlocked;
        const enemyScore = this.enemyTotalDamageCaused + this.enemyTotalDamageBlocked;
        if (heroScore > enemyScore) return 'hero';
        if (enemyScore > heroScore) return 'enemy';
        return 'tie';
    }

    muteGame() {
        this.sound.mute = !this.sound.mute;
    }

    pauseGame() {
        this.scene.pause();
        this.isGamePaused = true;
        this.pauseBackground.setVisible(true);
        this.pauseText.setVisible(true);
    }

    resumeGame() {
        this.scene.resume();
        this.isGamePaused = false;
        this.pauseBackground.setVisible(false);
        this.pauseText.setVisible(false);
    }
}
