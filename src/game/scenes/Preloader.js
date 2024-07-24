import { Scene } from 'phaser';
import { Character } from '../classes/Character';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.add.image(512, 384, 'background');

    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    this.load.on('progress', (progress) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath('assets');

    this.load.image('logo', 'logo.png');
    this.load.image('star', 'star.png');
  }

  create() {
    const hero = new Character({
      name: 'Hero',
      currentHealth: 100,
      totalHealth: 100,
      currentStamina: 100,
      totalStamina: 100,
      strength: 10,
      defense: 10,
      agility: 10,
      reflexes: 10,
    });

    const enemy = new Character({
      name: 'Enemy',
      currentHealth: 100,
      totalHealth: 100,
      currentStamina: 100,
      totalStamina: 100,
      strength: 10,
      defense: 10,
      agility: 10,
      reflexes: 10,
    });

    this.registry.set('hero', hero);
    this.registry.set('enemy', enemy);

    this.scene.start('MainMenu');
    // note: check on this
    //EventBus.emit('StartingStats', (hero, enemy))
  }
}
