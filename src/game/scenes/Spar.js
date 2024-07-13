import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightStateMachine } from "../stateMachines/FightStateMachine";

export class Spar extends Scene {
  constructor() {
    super("Spar");
    this.fightStateMachine = null;
  }

  init(data) {
    // Initialize or reset stats here
    this.playerStats = {
      health: 100,
      stamina: 100,
    };
    this.enemyStats = {
      health: 100,
      stamina: 100,
    };
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

    this.playerHealthText = this.add.text(16, 16, `Player Health: ${this.playerStats.health}`, { fontSize: '32px', fill: 'black' });
    this.enemyHealthText = this.add.text(685, 16, `Enemy Health: ${this.enemyStats.health}`, { fontSize: '32px', fill: 'black' });
    this.playerStaminaText = this.add.text(16, 48, `Player Stamina: ${this.playerStats.stamina}`, { fontSize: '32px', fill: 'black' });
    this.enemyStaminaText = this.add.text(667, 48, `Enemy Stamina: ${this.enemyStats.stamina}`, { fontSize: '32px', fill: 'black' });

    this.events.on('punch', this.playerPunch, this);
    this.events.on('kick', this.playerKick, this);
    this.events.on('special', this.specialMove, this);
    this.events.on('guard', this.guardMove, this);

    this.fightStateMachine = new FightStateMachine(this);
    this.fightStateMachine.start();

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    this.fightStateMachine.update();
  }

  playerPunch() {
    this.enemyStats.health -= 10;
    this.playerStats.stamina -= 10;
    this.enemyHealthText.setText(`Enemy Health: ${this.enemyStats.health}`);
    this.playerStaminaText.setText(`Player Stamina: ${this.playerStats.stamina}`);
  }

  playerKick() {
    this.enemyStats.health -= 20;
    this.playerStats.stamina -= 20;
    this.enemyHealthText.setText(`Enemy Health: ${this.enemyStats.health}`);
    this.playerStaminaText.setText(`Player Stamina: ${this.playerStats.stamina}`);
  }

  specialMove() {
    // Special move logic
  }

  guardMove() {
    // Guard move logic
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}