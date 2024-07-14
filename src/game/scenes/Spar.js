import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightRoundsStateMachine } from "../stateMachines/FightRoundsStateMachine";

export class Spar extends Scene {
  constructor() {
    super("Spar");
    this.fightStateMachine = null;
  }

  init(data) {
    // Initialize or reset stats here
    this.hero = this.registry.get('hero');
    this.sean = this.registry.get('sean');
  }

  create() {
    this.add.image(512, 384, "gym");

    this.add
      .text(512, 50, "Let's SPAR!", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.playerHealthText = this.add.text(16, 16, `Player Health: ${this.hero.currentHealth}`, { fontSize: '32px', fill: 'black' });
    this.enemyHealthText = this.add.text(685, 16, `Enemy Health: ${this.sean.currentHealth}`, { fontSize: '32px', fill: 'black' });
    this.playerStaminaText = this.add.text(16, 48, `Player Stamina: ${this.hero.currentStamina}`, { fontSize: '32px', fill: 'black' });
    this.enemyStaminaText = this.add.text(667, 48, `Enemy Stamina: ${this.sean.currentStamina}`, { fontSize: '32px', fill: 'black' });

    this.events.on('punch', this.heroPunch, this);
    this.events.on('kick', this.heroKick, this);
    this.events.on('special', this.specialMove, this);
    this.events.on('guard', this.guardMove, this);

    this.events.on('heroAction', this.heroAction, this);
    this.events.on('enemyAction', this.enemyAction, this);

    this.fightStateMachine = new FightRoundsStateMachine(this);
    this.fightStateMachine.start();

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    this.fightStateMachine.update();
  }

  heroPunch() {
    this.sean.updateHealth(-10);
    this.hero.updateStamina(-10);
    this.enemyHealthText.setText(`Enemy Health: ${this.sean.currentHealth}`);
    this.playerStaminaText.setText(`Player Stamina: ${this.hero.currentStamina}`);
  }

  heroKick() {
    this.sean.updateHealth(-20);
    this.hero.updateStamina(-20);
    this.enemyHealthText.setText(`Enemy Health: ${this.sean.currentHealth}`);
    this.playerStaminaText.setText(`Player Stamina: ${this.hero.currentStamina}`);
  }

  specialMove() {
    // Special move logic
  }

  guardMove() {
    // Guard move logic
  }

  heroAction() {
    this.heroPunch(); // Example action, can be more complex
    console.log('Hero action performed');
  }

  enemyAction() {
    this.hero.updateHealth(-10); // Example action, can be more complex
    this.playerHealthText.setText(`Player Health: ${this.hero.currentHealth}`);
    console.log('Enemy action performed');
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
