import { Boot } from "./scenes/Boot";
import { Spar } from "./scenes/Spar";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { CharacterSelectionScene } from "./scenes/CharacterSelectionScene";
import { PostFight } from "./scenes/PostFight";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";

const StartGame = (parent) => {
    return new Phaser.Game({
        type: Phaser.AUTO,
        scale: {
            parent: "game-container",
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.FIT,
        },
        scene: [Boot, Preloader, MainMenu, CharacterSelectionScene, Spar, GameOver, PostFight],
        parent,
    });
};

export default StartGame;

