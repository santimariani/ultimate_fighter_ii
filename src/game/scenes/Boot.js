import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // Essential assets for Preloader or initial scenes
        this.load.image("backgroundSelect", "assets/gym3.png");
        this.load.image("introFirst", "assets/introFirst.png");
        this.load.image("introSecond", "assets/introSecond.png");
        this.load.image("subtitle", "assets/subtitle.png");

        // Minimal audio for initial scenes
        this.load.audio("menuIntro", "assets/menuIntro.wav");
        this.load.audio("menuLoop", "assets/menuLoop.wav");
    }

    create() {
        this.scene.start("Preloader");
    }
}