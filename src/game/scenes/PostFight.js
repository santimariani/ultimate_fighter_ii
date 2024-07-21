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
        this.tie = data.tie;
        this.winner = data.winner;
        console.log("PostFight init data:", data); // Debugging
    }

    create() {
        this.add.image(512, 384, "background").setAlpha(0.7);

        let fightEndText;
        if (this.tie) {
            this.winner = this.determineWinner();
            fightEndText = this.winner === "tie" ? "FIGHT OVER BY ROUNDS, IT'S A TIE!" : `FIGHT OVER BY ROUNDS, WINNER ${this.winner.toUpperCase()}`;
        } else if (this.winner) {
            fightEndText = `FIGHT OVER BY KO, WINNER ${this.winner.toUpperCase()}`;
        } else {
            fightEndText = "FIGHT OVER, UNDETERMINED WINNER";
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

        this.add
            .text(256, 300, `Total Damage Caused: ${this.heroTotalDamageCaused}`, {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(256, 350, `Total Damage Blocked: ${this.heroTotalDamageBlocked}`, {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(768, 300, `Total Damage Caused: ${this.enemyTotalDamageCaused}`, {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(768, 350, `Total Damage Blocked: ${this.enemyTotalDamageBlocked}`, {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        const heroFinalScore = this.heroTotalDamageCaused + this.heroTotalDamageBlocked;
        const enemyFinalScore = this.enemyTotalDamageCaused + this.enemyTotalDamageBlocked;

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

        console.log("Winner before display:", this.winner); // Debugging

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
                .text(512, 500, `WINNER: IT'S A TIE!`, {
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

        EventBus.emit("current-scene-ready", this);
    }

    determineWinner() {
        const heroScore = this.heroTotalDamageCaused + this.heroTotalDamageBlocked;
        const enemyScore = this.enemyTotalDamageCaused + this.enemyTotalDamageBlocked;

        if (heroScore > enemyScore) {
            return "hero";
        } else if (enemyScore > heroScore) {
            return "enemy";
        } else {
            return "tie";
        }
    }
}
