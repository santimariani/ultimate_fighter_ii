import { Boot } from './scenes/Boot';
import { Spar } from './scenes/Spar';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { PostFight } from './scenes/PostFight';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
// const config = {
//     type: Phaser.AUTO,
//     // backgroundColor: "#037603",
//     scale: {
//         parent: "game-container",
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.FIT,
//     },
//     scene: [Boot, Preloader, MainMenu, Game, GameOver],
// };

const StartGame = (parent) => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
      parent: 'game-container',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.FIT,
    },
    scene: [Boot, Preloader, MainMenu, Spar, GameOver, PostFight],
    parent,
  });
};

export default StartGame;
