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
        this.enemy = this.registry.get('enemy');
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
        this.enemyHealthText = this.add.text(685, 16, `Enemy Health: ${this.enemy.currentHealth}`, { fontSize: '32px', fill: 'black' });
        this.playerStaminaText = this.add.text(16, 48, `Player Stamina: ${this.hero.currentStamina}`, { fontSize: '32px', fill: 'black' });
        this.enemyStaminaText = this.add.text(667, 48, `Enemy Stamina: ${this.enemy.currentStamina}`, { fontSize: '32px', fill: 'black' });

        this.events.on('punch', this.heroPunch, this);
        this.events.on('kick', this.heroKick, this);
        this.events.on('special', this.specialMove, this);
        this.events.on('guard', this.guardMove, this);

        this.events.on('heroAction', () => {
            EventBus.emit("enableInput"); // Enable player input
        }, this);
        this.events.on('enemyAction', this.enemyAction, this);

        this.fightStateMachine = new FightRoundsStateMachine(this);
        this.fightStateMachine.start();

        EventBus.emit("current-scene-ready", this);
        EventBus.on("playerAction", this.heroAction.bind(this));  // Listen for player action events
    }

    update() {
        this.fightStateMachine.update();
    }
    
        heroAction(action) {
            switch(action) {
                case 'punch':
                    this.heroPunch();
                    break;
                case 'kick':
                    this.heroKick();
                    break;
                case 'special':
                    this.specialMove();
                    break;
                case 'guard':
                    this.guardMove();
                    break;
                default:
                    console.log('Unknown action:', action);
            }
            console.log('Hero action performed:', action);
        }

    heroPunch() {
        if (this.enemy.currentHealth > 0 && this.hero.currentStamina >= 10) {
            this.enemy.updateHealth(-10);
            this.hero.updateStamina(-10);
            this.enemyHealthText.setText(`Enemy Health: ${this.enemy.currentHealth}`);
            this.playerStaminaText.setText(`Player Stamina: ${this.hero.currentStamina}`);
            this.events.emit("heroActionComplete");
        }
    }

    heroKick() {
        if (this.enemy.currentHealth > 0 && this.hero.currentStamina >= 20) {
            this.enemy.updateHealth(-20);
            this.hero.updateStamina(-20);
            this.enemyHealthText.setText(`Enemy Health: ${this.enemy.currentHealth}`);
            this.playerStaminaText.setText(`Player Stamina: ${this.hero.currentStamina}`);
            this.events.emit("heroActionComplete");
        }
    }

    specialMove() {
        // Special move logic
        this.events.emit("heroActionComplete");
    }

    guardMove() {
        // Guard move logic
        this.events.emit("heroActionComplete");
    }

    enemyAction() {
        setTimeout(() => {
            this.hero.updateHealth(-50); // Example action, can be more complex
            this.playerHealthText.setText(`Player Health: ${this.hero.currentHealth}`);
            console.log('Enemy action performed');
            this.events.emit("enemyActionComplete");
        }, 1000); // 1 second delay
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
