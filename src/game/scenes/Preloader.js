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
    }

    create() {
        const hero = new Character({
            name: "Hero",
            totalHealth: 100,
            currentHealth: 100,
            totalStamina: 100,
            currentStamina: 100,
            strength: 5,
            defense: 5,
            agility: 5,
            reflexes: 5,
        });

        const enemy = new Character({
            name: "Enemy",
            totalHealth: 100,
            currentHealth: 100,
            totalStamina: 100,
            currentStamina: 100,
            strength: 5,
            defense: 5,
            agility: 5,
            reflexes: 5,
        });

        this.registry.set("hero", hero);
        this.registry.set("enemy", enemy);

        this.scene.start("MainMenu");
    }
}

