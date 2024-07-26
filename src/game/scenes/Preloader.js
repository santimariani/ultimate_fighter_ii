import { Scene } from "phaser";
import { Character } from "../classes/Character";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.add.image(512, 384, "background");

        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.load.on("progress", (progress) => {
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");
        this.load.image("star", "star.png");
        this.load.image("heroSprite", "assets/hero.png");
        this.load.image("enemySprite", "assets/enemy.png");

        this.load.image("punchReg1", "assets/punchReg1.png");
        this.load.image("punchReg2", "assets/punchReg2.png");
        this.load.image("punchReg3", "assets/punchReg3.png");
        this.load.image("punchReg4", "assets/punchReg4.png");
        this.load.image("punchReg5", "assets/punchReg5.png");
        this.load.image("punchReg6", "assets/punchReg6.png");
    }

    create() {
        this.anims.create({
            key: "punchReg",
            frames: [
                { key: "punchReg1" },
                { key: "punchReg2" },
                { key: "punchReg3" },
                { key: "punchReg4" },
                { key: "punchReg5" },
                { key: "punchReg6" },

                // Add more frames as needed
            ],
            frameRate: 30, // Adjust the frame rate as needed
            repeat: 0, // Set to -1 to loop the animation indefinitely
            hideOnComplete: true // Hides the sprite on animation complete
        });

        this.anims.create({
            key: "special",
            frames: [
                { key: "punchMas1" },
                { key: "punchMas2" },
                { key: "punchMas3" },
                { key: "punchMas4" },
                { key: "punchMas5" },
                { key: "punchMas6" },
                // Add more frames as needed
            ],
            frameRate: 50, // Adjust the frame rate as needed
            repeat: 0, // Set to -1 to loop the animation indefinitely
            hideOnComplete: true // Hides the sprite on animation complete
        });

        const heroSprite = this.add
            .image(100, 100, "heroSprite")
            .setVisible(false);
        const enemySprite = this.add
            .image(500, 100, "enemySprite")
            .setVisible(false);

        const hero = new Character({
            name: "Santi",
            currentHealth: 70,
            totalHealth: 70,
            currentStamina: 130,
            totalStamina: 130,
            strength: 9,
            defense: 7,
            agility: 13,
            reflexes: 11,
            sprite: heroSprite, // Assign the sprite to the character
        });

        const enemy = new Character({
            name: "Matu",
            currentHealth: 80,
            totalHealth: 80,
            currentStamina: 120,
            totalStamina: 120,
            strength: 14,
            defense: 6,
            agility: 10,
            reflexes: 10,
            sprite: enemySprite, // Assign the sprite to the character
        });

        console.log("Hero sprite:", hero.sprite); // Debugging line
        console.log("Enemy sprite:", enemy.sprite); // Debugging line

        this.registry.set("hero", hero);
        this.registry.set("enemy", enemy);

        this.scene.start("MainMenu");
    }
}

