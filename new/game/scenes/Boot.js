import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        this.load.image('backgroundSelect', 'assets/gym3.png');

        this.load.image("introFirst", "assets/introFirst.png");
        this.load.image("introSecond", "assets/introSecond.png");
        this.load.image("subtitle", "assets/subtitle.png");


        this.load.image("background", "assets/bg.png");
        this.load.image("gym", "assets/gym.png");
        this.load.image("heroSprite", "assets/hero.png");
        this.load.image("enemySprite", "assets/enemy.png");
        this.load.image("healthBar", "assets/healthBar.png");
        this.load.image("roundNumber", "assets/roundNumber.png");
        this.load.image("options", "assets/options.png");
        this.load.image("info", "assets/info.png");
        this.load.audio("sparIntro", "assets/sparIntro.wav");
        this.load.audio("sparLoop", "assets/sparLoop.wav");
        this.load.audio("menuIntro", "assets/menuIntro.wav");
        this.load.audio("menuLoop", "assets/menuLoop.wav");
        

        this.load.image("punchReg1", "assets/punchReg1.png");
        this.load.image("punchReg2", "assets/punchReg2.png");
        this.load.image("punchReg3", "assets/punchReg3.png");
        this.load.image("punchReg4", "assets/punchReg4.png");
        this.load.image("punchReg5", "assets/punchReg5.png");
        this.load.image("punchReg6", "assets/punchReg6.png");

        this.load.image("punchMas1", "assets/punchMas1.png");
        this.load.image("punchMas2", "assets/punchMas2.png");
        this.load.image("punchMas3", "assets/punchMas3.png");
        this.load.image("punchMas4", "assets/punchMas4.png");
        this.load.image("punchMas5", "assets/punchMas5.png");
        this.load.image("punchMas6", "assets/punchMas6.png");



        this.load.audio("punch1", "assets/hit01.mp3.flac");
        this.load.audio("punch2", "assets/hit02.mp3.flac");
        this.load.audio("punch3", "assets/hit03.mp3.flac");
        this.load.audio("punch4", "assets/hit04.mp3.flac");
        this.load.audio("punch5", "assets/hit05.mp3.flac");
        this.load.audio("punch6", "assets/hit06.mp3.flac");
        this.load.audio("punch7", "assets/hit07.mp3.flac");
        this.load.audio("punch8", "assets/hit08.mp3.flac");
        this.load.audio("punch9", "assets/hit09.mp3.flac");

        this.load.audio("massivePunch", "assets/hit20.mp3.flac");

        this.load.audio("kick1", "assets/hit10.mp3.flac");
        this.load.audio("kick2", "assets/hit11.mp3.flac");
        this.load.audio("kick3", "assets/hit12.mp3.flac");
        this.load.audio("kick4", "assets/hit13.mp3.flac");
        this.load.audio("kick5", "assets/hit14.mp3.flac");
        this.load.audio("kick6", "assets/hit15.mp3.flac");
        this.load.audio("kick7", "assets/hit16.mp3.flac");
        this.load.audio("kick8", "assets/hit17.mp3.flac");
        this.load.audio("kick9", "assets/hit18.mp3.flac");

        this.load.audio("massiveKick", "assets/hit19.mp3.flac");

        this.load.audio("special", "assets/hit37.mp3.flac");
    }

    create() {
        this.scene.start("Preloader");
    }
}

