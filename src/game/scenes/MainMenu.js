import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(512, 384, "background");

        const startButton = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "GET STARTED!",
                {
                    fontFamily: "Arial Black",
                    fontSize: 28, // Slightly smaller font size
                    color: "#ffffff",
                    backgroundColor: "#28421a", // Green background
                    padding: { x: 15, y: 8 }, // Reduced padding for a smaller button
                }
            )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("CharacterSelectionScene");
            })
            .on("pointerover", () => {
                startButton.setStyle({
                    backgroundColor: "#0ec3c9",
                    border: "3px solid #ffffff",
                });
            })
            .on("pointerout", () => {
                startButton.setStyle({
                    backgroundColor: "#28421a",
                    border: "0.1vw solid rgba(255, 255, 255, 0.87)",
                });
            });

        EventBus.on("goToNextScene", () => {
            this.scene.start("CharacterSelectionScene");
        });

        EventBus.emit("current-scene-ready", this);
    }
}

