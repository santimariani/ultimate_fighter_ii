import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightRoundsStateMachine } from "../stateMachines/FightRoundsStateMachine";
import CombatActions from "../classes/CombatActions";

export class Spar extends Scene {
    constructor() {
        super("Spar");
        this.fightStateMachine = null;
        this.isInitialized = false;
        this.heroTotalDamageCaused = 0;
        this.heroTotalDamageBlocked = 0;
        this.enemyTotalDamageCaused = 0;
        this.enemyTotalDamageBlocked = 0;
    }

    init(data) {
        this.hero = this.registry.get("hero");
        this.enemy = this.registry.get("enemy");
        this.heroCombatActions = new CombatActions(this.hero, this.enemy);
        this.enemyCombatActions = new CombatActions(this.enemy, this.hero);

        // Override the updateHealth method to track damage
        this.hero.updateHealth = (amount) => {
            if (amount < 0) {
                this.enemyTotalDamageCaused += Math.abs(amount);
            }
            this.hero.currentHealth += amount;
            if (this.hero.currentHealth > this.hero.totalHealth) {
                this.hero.currentHealth = this.hero.totalHealth;
            } else if (this.hero.currentHealth < 0) {
                this.hero.currentHealth = 0;
            }
        };

        this.enemy.updateHealth = (amount) => {
            if (amount < 0) {
                this.heroTotalDamageCaused += Math.abs(amount);
            }
            this.enemy.currentHealth += amount;
            if (this.enemy.currentHealth > this.enemy.totalHealth) {
                this.enemy.currentHealth = this.enemy.totalHealth;
            } else if (this.enemy.currentHealth < 0) {
                this.enemy.currentHealth = 0;
            }
        };
    }

    create() {
        this.sparIntro = this.sound.add('sparIntro', {
            loop: false,
            volume: 0.5});
        this.sparLoop = this.sound.add('sparLoop', {
            loop: true,
            volume: 0.5});
        
        // Add characters and text with appropriate delays
        this.time.delayedCall(750, this.addLeftFighter, [], this);
        this.time.delayedCall(2300, this.addVsText, [], this);
        this.time.delayedCall(2850, this.addRightFighter, [], this);
        this.time.delayedCall(5100, this.updateBackgroundAndText, [], this);
        this.time.delayedCall(6650, this.showStatsAndRemoveFight, [], this);

        // Add hero and enemy stats text, initially hidden
        this.heroHealthText = this.add.text(16, 16, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);
        this.heroPowerBoost = this.add.text(16, 48, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);
        this.heroStaminaText = this.add.text(16, 80, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);
        this.heroSwiftnessBoost = this.add.text(16, 112, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);
        this.enemyHealthText = this.add.text(550, 16, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);
        this.enemyPowerBoost = this.add.text(550, 48, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);
        this.enemyStaminaText = this.add.text(550, 80, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);
        this.enemySwiftnessBoost = this.add.text(550, 112, "", {
            fontSize: "32px",
            fill: "black",
        }).setVisible(false);

        this.updateTextElements();

        // Event listeners for combat actions
        this.events.on(
            "punch",
            this.heroCombatActions.punch.bind(this.heroCombatActions)
        );
        this.events.on(
            "kick",
            this.heroCombatActions.kick.bind(this.heroCombatActions)
        );
        this.events.on(
            "special",
            this.heroCombatActions.special.bind(this.heroCombatActions)
        );
        this.events.on(
            "guard",
            this.heroCombatActions.guard.bind(this.heroCombatActions)
        );

        this.events.on(
            "heroAction",
            () => {
                EventBus.emit("playerTurnEnabled");
            },
            this
        );
        this.events.on("enemyAction", this.enemyAction, this);

        this.events.on("fightEnded", this.changePostFightScene, this);

        EventBus.on("playerAction", this.heroAction.bind(this));

        EventBus.emit("current-scene-ready", this);

        EventBus.on("updateUi", (x) => {
            return this.updateStatsUi(x);
        });
    }

    addLeftFighter() {
        this.sparIntro.play();
        this.add.image(this.cameras.main.width * 0.2, this.cameras.main.height * 0.65, "santi")
            .setOrigin(0.5);
    }

    addVsText() {
        this.vsText = this.add.text(this.cameras.main.width * 0.5, this.cameras.main.height * 0.5, "VS", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);
    }

    addRightFighter() {
        this.add.image(this.cameras.main.width * 0.8, this.cameras.main.height * 0.65, "matu")
            .setOrigin(0.5);
    }

    updateBackgroundAndText() {
        if (this.vsText) {
            this.vsText.setText("FIGHT");
        };
        this.sparLoop.play();
    }

    showStatsAndRemoveFight() {
        this.add.image(512, 384, "gym").setDepth(-1); // Initial background
        if (this.vsText) {
            this.vsText.destroy();
        }
        this.heroHealthText.setVisible(true);
        this.heroPowerBoost.setVisible(true);
        this.heroStaminaText.setVisible(true);
        this.heroSwiftnessBoost.setVisible(true);
        this.enemyHealthText.setVisible(true);
        this.enemyPowerBoost.setVisible(true);
        this.enemyStaminaText.setVisible(true);
        this.enemySwiftnessBoost.setVisible(true);

        this.fightStateMachine = new FightRoundsStateMachine(this);
        this.fightStateMachine.start();

        this.isInitialized = true;
        EventBus.emit("fightStateMachineInitialized");
    }


    update() {
        if (this.isInitialized) { 
            this.fightStateMachine.update();
        }
        this.updateTextElements();
    }

    updateStatsUi(x) {
        // Hero
        this.hero.currentHealth = x.hero.currentHealth;
        this.hero.totalHealth = x.hero.totalHealth;
        this.hero.currentStamina = x.hero.currentStamina;
        this.hero.totalStamina = x.hero.totalStamina;
        // Enemy
        this.enemy.currentHealth = x.enemy.currentHealth;
        this.enemy.totalHealth = x.enemy.totalHealth;
        this.enemy.currentStamina = x.enemy.currentStamina;
        this.enemy.totalStamina = x.enemy.totalStamina;
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
            `Swiftness Boost: +${((this.hero.swiftnessBoost - 1) * 100).toFixed(
                0
            )}%`
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
            `Swiftness Boost: +${(
                (this.enemy.swiftnessBoost - 1) *
                100
            ).toFixed(0)}%`
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
        this.heroTotalDamageBlocked = this.hero.damageBlocked;
        EventBus.emit("enemyTurn");
        this.events.emit("heroActionComplete");
    }

    enemyAction() {
        setTimeout(() => {
            const actions = ["punch", "kick", "guard"];
            let action;

            do {
                action = actions[Math.floor(Math.random() * actions.length)];
            } while (
                (action === "punch" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.punch
                            .requiredStamina) ||
                (action === "kick" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.kick
                            .requiredStamina) ||
                (action === "guard" &&
                    !(
                        this.enemy.currentHealth <
                            (this.enemy.totalHealth * 0.5) ||
                        this.enemy.currentStamina <
                            (this.enemy.totalStamina * 0.5)
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
            this.enemyTotalDamageBlocked = this.enemy.damageBlocked;
            this.events.emit("enemyActionComplete");
            EventBus.emit("playerTurn");
        }, 1000);
    }

    changePostFightScene({ tie, winner }) {
        this.scene.start("PostFight", {
            heroTotalDamageCaused: this.heroTotalDamageCaused,
            heroTotalDamageBlocked: this.heroTotalDamageBlocked,
            enemyTotalDamageCaused: this.enemyTotalDamageCaused,
            enemyTotalDamageBlocked: this.enemyTotalDamageBlocked,
            tie: tie,
            winner: winner,
        });
    }
}

