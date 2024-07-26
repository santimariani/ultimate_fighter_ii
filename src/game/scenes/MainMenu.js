import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        // Load any assets specific to this scene
        this.load.audio("menuIntro", "assets/menuIntro.wav");
        this.load.audio("menuLoop", "assets/menuLoop.wav");
        this.load.image("introFirst", "assets/introFirst.png");
        this.load.image("introSecond", "assets/introSecond.png");
    }

    create() {
        // Set the background color to white
        this.cameras.main.setBackgroundColor("#FFFFFF");


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

        // Add and play the introductory sound
        this.menuIntro = this.sound.add("menuIntro", {
            loop: false,
            volume: 0.5,
        });
        this.menuIntro.play();

        // Display the first intro image with a fade-in effect
        this.introImage = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "introFirst"
            )
            .setOrigin(0.5)
            .setAlpha(0);

        this.tweens.add({
            targets: this.introImage,
            alpha: { from: 0, to: 1 },
            duration: 3500, // 3.5 seconds fade-in
            ease: "Power2",
            onComplete: () => {
                // Switch to the second intro image
                this.introImage.setTexture("introSecond");

                // Introduce a slight delay before playing the introLoop and showing the button
                this.time.delayedCall(1500, () => {
                    // Play the intro loop sound
                    this.introLoop = this.sound.add("menuLoop", { loop: true, volume: 0.5 });
                    this.introLoop.play();

                    // Add the "GET STARTED!" button with a slap effect
                    const startButton = this.add
                        .text(
                            this.cameras.main.width / 2,
                            this.cameras.main.height / 1.5,
                            "GET STARTED!",
                            {
                                fontFamily: "Arial Black",
                                fontSize: 28,
                                color: "#ffffff",
                                backgroundColor: "#ff0000", // Red background
                                padding: { x: 20, y: 10 },
                            }
                        )
                        .setOrigin(0.5)
                        .setScale(0.5)
                        .setInteractive();

                    // Slap effect for the "GET STARTED!" button
                    this.tweens.add({
                        targets: startButton,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 300, // Quick slap effect
                        ease: "Bounce.easeOut",
                        onComplete: () => {
                            // Slow grow-and-shrink animation
                            this.tweens.add({
                                targets: startButton,
                                scaleX: 1.1,
                                scaleY: 1.1,
                                duration: 1000,
                                yoyo: true,
                                repeat: -1,
                                ease: "Sine.easeInOut",
                            });
                        },
                    });

                    // Button interaction
                    startButton.on("pointerdown", () => {
                        this.scene.start("CharacterSelectionScene");
                    });

                    startButton.on("pointerover", () => {
                        startButton.setStyle({
                            backgroundColor: "#ff4c4c", // Slightly lighter red
                            border: "3px solid #ffffff",
                        });
                    });

                    startButton.on("pointerout", () => {
                        startButton.setStyle({
                            backgroundColor: "#ff0000",
                            border: "0.1vw solid rgba(255, 255, 255, 0.87)",
                        });
                    });
                }, null, this); // Ensure 'this' refers to the current scene
            },
            callbackScope: this, // Ensure 'this' refers to the current scene
        });

        EventBus.on("goToNextScene", () => {
            this.scene.start("CharacterSelectionScene");
        });

        EventBus.on("muteGame", this.muteGame, this);
        EventBus.on("pauseGame", this.pauseGame, this);
        EventBus.on("resumeGame", this.resumeGame, this);

        EventBus.emit("current-scene-ready", this);
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

