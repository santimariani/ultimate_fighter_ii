import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightRoundsStateMachine } from "../stateMachines/FightRoundsStateMachine";

export class Spar extends Scene {
  constructor() {
    super("Spar");
    this.fightStateMachine = null;
  }

  init(data) {
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

    this.events.on('heroAction', this.enablePlayerInput, this);
    this.events.on('enemyAction', this.enemyAction, this);
    this.events.on('roundComplete', this.onRoundComplete, this);

    this.fightStateMachine = new FightRoundsStateMachine(this);
    this.fightStateMachine.start();

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    this.fightStateMachine.update();
  }

  enablePlayerInput() {
    this.events.emit('enablePlayerInput');
  }

  heroPunch() {
    if (this.sean.currentHealth > 0 && this.hero.currentStamina >= 10) {
      const damage = 10;
      this.sean.updateHealth(-damage);
      this.hero.updateStamina(-10);
      this.enemyHealthText.setText(`Enemy Health: ${this.sean.currentHealth}`);
      this.playerStaminaText.setText(`Player Stamina: ${this.hero.currentStamina}`);
      this.events.emit('heroActionComplete');
    }
  }

  heroKick() {
    if (this.sean.currentHealth > 0 && this.hero.currentStamina >= 20) {
      const damage = 20;
      this.sean.updateHealth(-damage);
      this.hero.updateStamina(-20);
      this.enemyHealthText.setText(`Enemy Health: ${this.sean.currentHealth}`);
      this.playerStaminaText.setText(`Player Stamina: ${this.hero.currentStamina}`);
      this.events.emit('heroActionComplete');
    }
  }

  specialMove() {
    // Special move logic
    this.events.emit('heroActionComplete');
  }

  guardMove() {
    // Guard move logic
    this.events.emit('heroActionComplete');
  }

  enemyAction() {
    if (this.hero.currentHealth > 0) {
      const damage = 10;
      this.hero.updateHealth(-damage);
      this.playerHealthText.setText(`Player Health: ${this.hero.currentHealth}`);
      console.log('Enemy action performed');
      this.events.emit('enemyActionComplete');
    }
  }

  onRoundComplete() {
    if (this.hero.currentHealth <= 0 || this.sean.currentHealth <= 0) {
      this.scene.start("GameOver");
    } else {
      this.fightStateMachine.setState(FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS);
    }
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
