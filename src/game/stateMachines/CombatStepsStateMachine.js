import { EventBus } from '../EventBus';

export class CombatStepsStateMachine {
  static ROUND_STEP_STATES = {
    DETERMINE_FIRST_ACTOR: 'DETERMINE_FIRST_ACTOR',
    FIRST_ACTION: 'FIRST_ACTION',
    SECOND_ACTION: 'SECOND_ACTION',
    ROUND_COMPLETE: 'ROUND_COMPLETE',
  };

  constructor(scene, hero, enemy) {
    this.scene = scene;
    this.hero = hero;
    this.enemy = enemy;
    this.currentStep = null;
    this.firstActor = null;
    this.secondActor = null;

    // Bind the event listeners
    this.handleHeroActionComplete = this.handleHeroActionComplete.bind(this);
    this.handleEnemyActionComplete = this.handleEnemyActionComplete.bind(this);
  }

  startRound() {
    this.setState(
      CombatStepsStateMachine.ROUND_STEP_STATES.DETERMINE_FIRST_ACTOR
    );
  }

  setState(state) {
    this.currentStep = state;
    switch (state) {
      case CombatStepsStateMachine.ROUND_STEP_STATES.DETERMINE_FIRST_ACTOR:
        this.determineFirstActor();
        break;
      case CombatStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION:
        this.firstAction();
        break;
      case CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION:
        this.secondAction();
        break;
      case CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE:
        this.scene.events.emit('roundComplete');
        break;
      default:
        console.warn('something went wrong');
    }
  }

  update() {
    if (
      this.currentStep ===
      CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
    ) {
      return true;
    }
  }

  isRoundComplete() {
    return (
      this.currentStep ===
      CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
    );
  }

  determineFirstActor() {
    let heroAgility, enemyAgility;
    heroAgility = Phaser.Math.Between(1, this.hero.agility);
    enemyAgility = Phaser.Math.Between(1, this.enemy.agility);
    if (heroAgility > enemyAgility) {
      this.firstActor = 'hero';
      this.secondActor = 'enemy';
      console.log('Hero takes the initiative!');
    } else {
      this.firstActor = 'enemy';
      this.secondActor = 'hero';
      console.log('Enemy takes the initiative!');
    }
    this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION);
  }

  firstAction() {
    if (this.firstActor === 'hero') {
      console.log('Hero considers his options...');
      this.scene.events.emit('heroGo');
      this.scene.events.once(
        'heroActionComplete',
        this.handleHeroActionComplete
      );
    }
    if (this.firstActor === 'enemy') {
      console.log('Enemy considers his options...');
      this.scene.events.emit('enemyGo');
      this.scene.events.once(
        'enemyActionComplete',
        this.handleEnemyActionComplete
      );
    }
  }

  secondAction() {
    if (this.secondActor === 'hero') {
      console.log('Hero considers his options...');
      this.scene.events.emit('heroGo');
      this.scene.events.once(
        'heroActionComplete',
        this.handleHeroActionComplete
      );
    }
    if (this.secondActor === 'enemy') {
      console.log('Enemy considers his options...');
      this.scene.events.emit('enemyGo');
      this.scene.events.once(
        'enemyActionComplete',
        this.handleEnemyActionComplete
      );
    }
  }

  handleHeroActionComplete() {
    if (this.enemy.currentHealth > 0) {
      if (
        this.currentStep ===
        CombatStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION
      ) {
        this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION);
      } else if (
        this.currentStep ===
        CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
      ) {
        this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE);
      }
    } else {
      const heroWins = true;
      console.log(`${this.hero.name} wins by Knock Out!`);
      this.scene.events.emit('fightEnded', heroWins);
    }
  }
  handleEnemyActionComplete() {
    if (this.hero.currentHealth > 0) {
      if (
        this.currentStep ===
        CombatStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION
      ) {
        this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION);
      } else if (
        this.currentStep ===
        CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
      ) {
        this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE);
      }
    } else {
      const enemyWins = true;
      console.log(`${this.enemy.name} wins by Knock Out!`);
      this.scene.events.emit('fightEnded', enemyWins);
    }
  }
}
