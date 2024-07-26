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
        this.add.image(512, 384, "background").setAlpha(0.7);

        // Display "FIGHT OVER BY" text
        this.time.delayedCall(750, () => {
            let fightEndText;
            if (this.knockOut) {
                fightEndText = `FIGHT OVER BY KO!`;
            } else if (this.roundOut) {
                this.winner = this.determineWinner();
                fightEndText = "FIGHT OVER BY ROUNDS!";
            } else {
                fightEndText = "FIGHT OVER!";
            }

            this.add
                .text(512, 100, fightEndText, {
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

        // Show Hero Stats Title
        this.time.delayedCall(2250, () => {
            this.add
                .text(256, 200, "Hero Stats", {
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

        // Display Hero Total Damage Caused
        this.time.delayedCall(3750, () => {
            this.add
                .text(
                    256,
                    300,
                    `Total Damage Caused: ${this.heroTotalDamageCaused}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 24,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        // Display Hero Total Damage Blocked
        this.time.delayedCall(4500, () => {
            this.add
                .text(
                    256,
                    350,
                    `Total Damage Blocked: ${this.heroTotalDamageBlocked}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 24,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        // Display Hero Final Score
        this.time.delayedCall(5250, () => {
            const heroFinalScore =
                this.heroTotalDamageCaused + this.heroTotalDamageBlocked;

            this.add
                .text(256, 400, `FINAL SCORE: ${heroFinalScore}`, {
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

        // Show Enemy Stats Title
        this.time.delayedCall(6750, () => {
            this.add
                .text(768, 200, "Enemy Stats", {
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

        // Display Enemy Total Damage Caused
        this.time.delayedCall(8250, () => {
            this.add
                .text(
                    768,
                    300,
                    `Total Damage Caused: ${this.enemyTotalDamageCaused}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 24,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        // Display Enemy Total Damage Blocked
        this.time.delayedCall(9000, () => {
            this.add
                .text(
                    768,
                    350,
                    `Total Damage Blocked: ${this.enemyTotalDamageBlocked}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 24,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(100);
        });

        // Display Enemy Final Score
        this.time.delayedCall(9750, () => {
            const enemyFinalScore =
                this.enemyTotalDamageCaused + this.enemyTotalDamageBlocked;

            this.add
                .text(768, 400, `FINAL SCORE: ${enemyFinalScore}`, {
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

        // Display Winner Announcement after 3 seconds following Enemy Final Score
        this.time.delayedCall(11500, () => {
            if (this.winner && this.winner !== "tie") {
                this.add
                    .text(512, 500, `WINNER: ${this.winner.toUpperCase()}!`, {
                        fontFamily: "Arial Black",
                        fontSize: 32,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    })
                    .setOrigin(0.5)
                    .setDepth(100);
            } else {
                this.add
                    .text(512, 500, `WINNER: ${this.knockOut ? this.knockOut.toUpperCase() : 'NONE'}`, {
                        fontFamily: "Arial Black",
                        fontSize: 32,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    })
                    .setOrigin(0.5)
                    .setDepth(100);
            }
        });

        EventBus.on("goToPreviousScene", () => {
            this.scene.start("Spar");
        });

        EventBus.emit("current-scene-ready", this);
    }

    determineWinner() {
        const heroScore =
            this.heroTotalDamageCaused + this.heroTotalDamageBlocked;
        const enemyScore =
            this.enemyTotalDamageCaused + this.enemyTotalDamageBlocked;

        if (heroScore > enemyScore) {
            return "hero";
        } else if (enemyScore > heroScore) {
            return "enemy";
        } else {
            return "tie";
        }
    }
}
