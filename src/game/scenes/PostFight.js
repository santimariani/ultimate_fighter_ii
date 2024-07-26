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

        // Display "FIGHT OVER BY" text
        this.time.delayedCall(750, () => {
            let fightEndText;
            if (this.knockOut) {
                fightEndText = `FIGHT OVER\nBY KO!`;
            } else if (this.roundOut) {
                this.winner = this.determineWinner();
                fightEndText = "FIGHT OVER\nBY ROUNDS!";
            } else {
                fightEndText = "FIGHT OVER!";
            }

            this.add
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
        });

        // Show Hero Stats Title and Background Box
        this.time.delayedCall(2250, () => {
            this.createHeroStatsBox();
            this.createHeroSprite();
            this.add
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
            this.add
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

            this.add
                .text(518, 450, winnerText, {
                    fontFamily: "Arial Black",
                    fontSize: 31,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100);

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
}
