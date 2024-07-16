import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightRoundsStateMachine } from "../stateMachines/FightRoundsStateMachine";

export class Spar extends Scene {
    constructor() {
        super("Spar");
        this.fightStateMachine = null;
    }

    init(data) {
        this.hero = this.registry.get("hero");
        this.enemy = this.registry.get("enemy");
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

        this.playerHealthText = this.add.text(
            16,
            16,
            `Player Health: ${this.hero.currentHealth} / ${this.hero.totalHealth}`,
            { fontSize: "32px", fill: "black" }
        );
        this.enemyHealthText = this.add.text(
            551,
            16,
            `Enemy Health: ${this.enemy.currentHealth} / ${this.enemy.totalHealth}`,
            { fontSize: "32px", fill: "black" }
        );
        this.playerStaminaText = this.add.text(
            16,
            48,
            `Player Stamina: ${this.hero.currentStamina} / ${this.hero.totalStamina}`,
            { fontSize: "32px", fill: "black" }
        );
        this.enemyStaminaText = this.add.text(
            550,
            48,
            `Enemy Stamina: ${this.enemy.currentStamina} / ${this.enemy.totalStamina}`,
            { fontSize: "32px", fill: "black" }
        );

        this.events.on("punch", this.heroPunch, this);
        this.events.on("kick", this.heroKick, this);
        this.events.on("special", this.specialMove, this);
        this.events.on("guard", this.guardMove, this);

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
        if (this.hero.currentHealth <= 0) {
            this.changeKOScene();
        }
    }

    heroAction(action) {
        switch (action) {
            case "punch":
                this.heroPunch();
                break;
            case "kick":
                this.heroKick();
                break;
            case "special":
                this.specialMove();
                console.log("Nothing happened!");
                break;
            case "guard":
                this.guardMove();
                break;
            default:
                console.log("Unknown action:", action);
        }
    }

    heroPunch() {
        if (this.enemy.currentHealth > 0 && this.hero.currentStamina >= 10) {
            const swiftnessBoost =
                this.hero.currentStamina / this.hero.totalStamina + 1;
            console.log(swiftnessBoost);
            const attackBoost =
                this.hero.currentHealth / this.hero.totalHealth + 1;
            console.log(attackBoost);
            this.hero.updateStamina(-10);
            this.playerStaminaText.setText(
                `Player Stamina: ${this.hero.currentStamina} / ${this.hero.totalStamina}`
            );

            let heroAgility, enemyReflexes;

            do {
                heroAgility = Math.ceil(
                    Phaser.Math.Between(1, this.hero.agility) * swiftnessBoost
                );
                console.log(heroAgility);
                enemyReflexes = Phaser.Math.Between(1, this.enemy.reflexes);
                console.log(enemyReflexes);
            } while (heroAgility === enemyReflexes);

            if (heroAgility > enemyReflexes) {
                let heroStrength = Math.ceil(
                    Phaser.Math.Between(1, this.hero.strength) * attackBoost
                );
                console.log(heroStrength);
                let enemyDefense = Phaser.Math.Between(1, this.enemy.defense);
                console.log(enemyDefense);

                let basicDamage = heroStrength - enemyDefense;
                if (basicDamage <= 0) {
                    basicDamage = 0;
                    console.log("Enemey absorbs all the damage!");
                } else {
                    const luck = Phaser.Math.Between(0, 1);
                    if (luck > 0.75) {
                        console.log("Hero lands a MASSIVE punch!");
                        const totalDamage = Math.ceil(basicDamage * 1.5);
                        console.log(`He deals ${totalDamage} damage`);
                        this.enemy.updateHealth(totalDamage * -1);
                    } else {
                        console.log("Hero lands a regular punch!");
                        const totalDamage = basicDamage * 1;
                        console.log(`He deals ${totalDamage} damage`);
                        this.enemy.updateHealth(totalDamage * -1);
                    }
                }
                this.enemyHealthText.setText(
                    `Enemy Health: ${this.enemy.currentHealth} / ${this.enemy.totalHealth}`
                );
                const damageBlocked = heroStrength - basicDamage;
                this.enemy.updateStamina(damageBlocked * -1);
                this.enemyStaminaText.setText(
                    `Enemy Stamina: ${this.enemy.currentStamina} / ${this.enemy.totalStamina}`
                );
                console.log(
                    `Enemy used up ${damageBlocked} stamina from blocking the attack.`
                );
            } else {
                console.log("Hero misses!");
            }
        } else {
            console.log("Hero is too exhausted and misses");
            this.hero.stamina = 0;
        }
        this.events.emit("heroActionComplete");
    }

    heroKick() {
        if (this.enemy.currentHealth > 0 && this.hero.currentStamina >= 20) {
            const swiftnessBoost =
                this.hero.currentStamina / this.hero.totalStamina + 1;
            console.log(swiftnessBoost);
            const attackBoost =
                this.hero.currentHealth / this.hero.totalHealth + 1;
            console.log(attackBoost);
            this.hero.updateStamina(-20);
            this.playerStaminaText.setText(
                `Player Health: ${this.hero.currentStamina} / ${this.hero.totalStamina}`
            );

            let heroAgility, enemyReflexes;

            do {
                heroAgility = Math.ceil(
                    Phaser.Math.Between(1, this.hero.agility) * swiftnessBoost
                );
                console.log(heroAgility);
                enemyReflexes = Phaser.Math.Between(1, this.enemy.reflexes);
                console.log(enemyReflexes);
            } while (heroAgility === enemyReflexes);

            if (heroAgility > enemyReflexes) {
                let heroStrength = Math.ceil(
                    Phaser.Math.Between(1, this.hero.strength) * attackBoost
                );
                console.log(heroStrength);
                let enemyDefense = Phaser.Math.Between(1, this.enemy.defense);
                console.log(enemyDefense);

                let basicDamage = heroStrength - enemyDefense;
                if (basicDamage <= 0) {
                    basicDamage = 0;
                    console.log("Enemey absorbs all the damage!");
                } else {
                    const luck = Phaser.Math.Between(0, 1);
                    if (luck > 0.5) {
                        console.log("Hero lands a MASSIVE kick!");
                        const totalDamage = Math.ceil(basicDamage * 3);
                        console.log(`He deals ${totalDamage} damage`);
                        this.enemy.updateHealth(totalDamage * -1);
                    } else {
                        console.log("Hero lands a regular kick!");
                        const totalDamage = basicDamage * 1;
                        console.log(`He deals ${totalDamage} damage`);
                        this.enemy.updateHealth(totalDamage * -1);
                    }
                }
                this.enemyHealthText.setText(
                    `Enemy Health: ${this.enemy.currentHealth} / ${this.enemy.totalHealth}`
                );
                this.enemy.updateStamina(enemyDefense * -1);
                this.enemyStaminaText.setText(
                    `Enemy Stamina: ${this.enemy.currentStamina} / ${this.enemy.totalStamina}`
                );
                console.log(
                    `Enemy used up ${enemyDefense} stamina from blocking the attack.`
                );
            } else {
                console.log("Hero misses!");
            }
        } else {
            console.log("Hero is too exhausted and misses");
            this.hero.stamina = 0;
        }
        this.events.emit("heroActionComplete");
    }

    specialMove() {
        // Special move logic
        this.events.emit("heroActionComplete");
    }

    guardMove() {
        console.log("Player defends!");
        const healthIncrease = Math.ceil(
            this.hero.totalHealth * 0.25 + this.hero.defense
        );
        const staminaIncrease = Math.ceil(
            this.hero.totalStamina * 0.25 + this.hero.reflexes
        );
        console.log(
            `Hero's health increased ${healthIncrease} and stamina ${staminaIncrease}`
        );
        this.hero.updateHealth(healthIncrease * 1);
        this.playerHealthText.setText(
            `Player Health: ${this.hero.currentHealth} / ${this.hero.totalHealth}`
        );
        this.hero.updateStamina(staminaIncrease * 1);
        this.playerStaminaText.setText(
            `Player Stamina: ${this.hero.currentStamina} / ${this.hero.totalStamina}`
        );
        console.log("Enemey takes the opportunity to do an extra attack!");
        this.events.emit("heroActionComplete");
    }

    enemyAction() {
        setTimeout(() => {
            this.hero.updateHealth(-10); 
            this.playerHealthText.setText(
                `Player Health: ${this.hero.currentHealth} / ${this.hero.totalHealth}`
            );

            this.events.emit("enemyActionComplete"); 
        }, 1000); // 1 second delay
    }

    changePostFightScene() {
        this.scene.start("MainMenu");
    }

    changeKOScene() {
        this.scene.start("GameOver");
    }
}

