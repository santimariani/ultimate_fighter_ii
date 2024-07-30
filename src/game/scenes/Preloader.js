import { Scene } from "phaser";
import { Character } from "../classes/Character";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.add.image(512, 384, "background");
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    }

    preload() {
        this.load.setPath("assets");

        // Essential assets for initial gameplay
        this.load.image("heroSprite", "hero.png");
        this.load.image("enemySprite", "enemy.png");

        // Only load the first frame of animations
        this.load.image("punchReg1", "punchReg1.png");
    }

    create() {
        this.createAnimations();
        this.initializeCharacters();

        this.scene.start("MainMenu");
    }

    createAnimations() {
        this.anims.create({
            key: "punchReg",
            frames: this.anims.generateFrameNames('punchReg', {
                start: 1,
                end: 6,
                prefix: 'punchReg',
                suffix: '.png'
            }),
            frameRate: 30,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "special",
            frames: this.anims.generateFrameNames('punchMas', {
                start: 1,
                end: 6,
                prefix: 'punchMas',
                suffix: '.png'
            }),
            frameRate: 50,
            repeat: 0,
            hideOnComplete: true
        });
    }

    initializeCharacters() {
        const heroSprite = this.add.image(100, 100, "heroSprite").setVisible(false);
        const enemySprite = this.add.image(500, 100, "enemySprite").setVisible(false);

        const hero = new Character({
            name: "Santi",
            currentHealth: 100,
            totalHealth: 100,
            currentStamina: 100,
            totalStamina: 100,
            strength: 10,
            defense: 10,
            agility: 10,
            reflexes: 10,
            sprite: heroSprite,
        });

        const enemy = new Character({
            name: "Matu",
            currentHealth: 120,
            totalHealth: 120,
            currentStamina: 80,
            totalStamina: 80,
            strength: 14,
            defense: 6,
            agility: 12,
            reflexes: 8,
            sprite: enemySprite,
        });

        this.registry.set("hero", hero);
        this.registry.set("enemy", enemy);
    }
}
