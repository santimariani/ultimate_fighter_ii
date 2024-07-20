import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightRoundsStateMachine } from "../stateMachines/FightRoundsStateMachine";
import CombatActions from "../classes/CombatActions";

export class Spar extends Scene {
    constructor() {
        super("Spar");
        this.fightStateMachine = null;
    }

    init(data) {
        this.hero = this.registry.get("hero");
        this.enemy = this.registry.get("enemy");
        this.heroCombatActions = new CombatActions(this.hero, this.enemy);
        this.enemyCombatActions = new CombatActions(this.enemy, this.hero);
    }

    create() {
        this.add.image(512, 384, "gym");

        this.add
            .text(512, 150, "Let's SPAR!", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.heroHealthText = this.add.text(
            16,
            16,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.heroPowerBoost = this.add.text(
            16,
            48,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.heroStaminaText = this.add.text(
            16,
            80,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.heroSwiftnessBoost = this.add.text(
            16,
            112,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.enemyHealthText = this.add.text(
            550,
            16,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.enemyPowerBoost = this.add.text(
            550,
            48,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.enemyStaminaText = this.add.text(
            550,
            80,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.enemySwiftnessBoost = this.add.text(
            550,
            112,
            "",
            { fontSize: "32px", fill: "black" }
        );

        this.updateTextElements();

        this.events.on("punch", this.heroCombatActions.punch.bind(this.heroCombatActions));
        this.events.on("kick", this.heroCombatActions.kick.bind(this.heroCombatActions));
        this.events.on("special", this.heroCombatActions.special.bind(this.heroCombatActions));
        this.events.on("guard", this.heroCombatActions.guard.bind(this.heroCombatActions));

        this.events.on(
            "heroAction",
            () => {
                EventBus.emit("enableInput");
            },
            this
        );
        this.events.on("enemyAction", this.enemyAction, this);

        this.fightStateMachine = new FightRoundsStateMachine(this);
        this.fightStateMachine.start();

        this.events.on("fightEnded", this.changePostFightScene, this);

        EventBus.on("playerAction", this.heroAction.bind(this));

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.fightStateMachine.update();
        this.updateTextElements();
        if (this.hero.currentHealth <= 0 || this.enemy.currentHealth <=0 ) {
            this.changeKOScene();
        }
    }

    updateTextElements() {
        this.heroHealthText.setText(
            `Hero Health: ${this.hero.currentHealth} / ${this.hero.totalHealth}`
        );
        this.heroPowerBoost.setText(
            `Power Boost: ${((this.hero.powerBoost - 1) * 100).toFixed(0)}%`
        );
        this.heroStaminaText.setText(
            `Hero Stamina: ${this.hero.currentStamina} / ${this.hero.totalStamina}`
        );
        this.heroSwiftnessBoost.setText(
            `Swiftness Boost: +${((this.hero.swiftnessBoost - 1) * 100).toFixed(0)}%`
        );
        this.enemyHealthText.setText(
            `Enemy Health: ${this.enemy.currentHealth} / ${this.enemy.totalHealth}`
        );
        this.enemyPowerBoost.setText(
            `Power Boost: ${((this.enemy.powerBoost - 1) * 100).toFixed(0)}%`
        );
        this.enemyStaminaText.setText(
            `Enemy Stamina: ${this.enemy.currentStamina} / ${this.enemy.totalStamina}`
        );
        this.enemySwiftnessBoost.setText(
            `Swiftness Boost: +${((this.enemy.swiftnessBoost - 1) * 100).toFixed(0)}%`
        );
    }

    heroAction(action) {
        switch (action) {
            case "punch":
                this.heroCombatActions.punch();
                break;
            case "kick":
                this.heroCombatActions.kick();
                break;
            case "special":
                this.heroCombatActions.special();
                break;
            case "guard":
                this.heroCombatActions.guard();
                break;
            default:
                console.log("Unknown action:", action);
        }
        this.events.emit("heroActionComplete");
    }

    enemyAction() {
        setTimeout(() => {
            const actions = ["punch", "kick", "guard"];
            let action;
    
            do {
                action = actions[Math.floor(Math.random() * actions.length)];
            } while (
                (action === "punch" && this.enemy.currentStamina < this.enemyCombatActions.attackTypes.punch.requiredStamina) ||
                (action === "kick" && this.enemy.currentStamina < this.enemyCombatActions.attackTypes.kick.requiredStamina) ||
                (action === "guard" &&
                    !(
                        this.enemy.currentHealth < this.enemy.totalHealth / 2 ||
                        this.enemy.currentStamina < this.enemy.totalStamina / 2
                    ))
            );
    
            switch (action) {
                case "punch":
                    this.enemyCombatActions.punch();
                    break;
                case "kick":
                    this.enemyCombatActions.kick();
                    break;
                case "special":
                    this.enemyCombatActions.special();
                    break;
                case "guard":
                    this.enemyCombatActions.guard();
                    break;
                default:
                    console.log("Unknown action:", action);
            }
            this.events.emit("enemyActionComplete");
        }, 1000);
    }

    changePostFightScene() {
        this.scene.start("MainMenu");
    }

    changeKOScene() {
        this.scene.start("GameOver");
    }
}
