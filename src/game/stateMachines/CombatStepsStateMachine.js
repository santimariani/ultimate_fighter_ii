export class CombatStepsStateMachine {
    static ROUND_STEP_STATES = {
        DETERMINE_FIRST_ACTOR: "DETERMINE_FIRST_ACTOR",
        FIRST_ACTION: "FIRST_ACTION",
        SECOND_ACTION: "SECOND_ACTION",
        ROUND_COMPLETE: "ROUND_COMPLETE",
    };

    constructor(scene, hero, enemy) {
        this.scene = scene;
        this.hero = hero;
        this.enemy = enemy;
        this.currentStep = null;
        this.firstActor = null;
        this.secondActor = null;

        this.handleHeroActionComplete = this.handleHeroActionComplete.bind(this);
        this.handleEnemyActionComplete = this.handleEnemyActionComplete.bind(this);
    }

    startRound() {
        this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.DETERMINE_FIRST_ACTOR);
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
                this.scene.events.emit("roundComplete");
                break;
        }
    }

    update() {
        if (this.currentStep === CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE) {
            return true;
        }
    }

    isRoundComplete() {
        return this.currentStep === CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE;
    }

    determineFirstActor() {
        let heroAgility = Phaser.Math.Between(1, this.hero.agility);
        let enemyAgility = Phaser.Math.Between(1, this.enemy.agility);

        if (heroAgility > enemyAgility) {
            this.firstActor = "hero";
            this.secondActor = "enemy";
        } else {
            this.firstActor = "enemy";
            this.secondActor = "hero";
        }
        this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION);
    }

    firstAction() {
        if (this.firstActor === "hero") {
            this.scene.updatePopupText(`${this.hero.name} takes \nthe initiative!`);
            this.scene.time.delayedCall(1500, () => {
                this.scene.events.emit("heroGo");
                this.scene.events.once("heroActionComplete", this.handleHeroActionComplete);
            });
        } else {
            this.scene.updatePopupText(`${this.enemy.name} takes \nthe initiative!`);
            this.scene.time.delayedCall(1500, () => {
                this.scene.events.emit("enemyGo");
                this.scene.events.once("enemyActionComplete", this.handleEnemyActionComplete);
            });
        }
    }

    secondAction() {
        if (this.secondActor === "hero") {
            this.scene.updatePopupText(`${this.hero.name} goes next!`);
            this.scene.time.delayedCall(1500, () => {
                this.scene.events.emit("heroGo");
                this.scene.events.once("heroActionComplete", this.handleHeroActionComplete);
            });
        } else {
            this.scene.updatePopupText(`${this.enemy.name} goes next!`);
            this.scene.time.delayedCall(1500, () => {
                this.scene.events.emit("enemyGo");
                this.scene.events.once("enemyActionComplete", this.handleEnemyActionComplete);
            });
        }
    }

    handleHeroActionComplete() {
        if (this.enemy.currentHealth > 0) {
            if (this.currentStep === CombatStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION) {
                this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION);
            } else if (this.currentStep === CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION) {
                this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE);
            }
        } else {
            const heroWins = true;
            console.log(`${this.hero.name} wins by Knock Out!`);
            this.scene.events.emit("fightEnded", heroWins);
        }
    }

    handleEnemyActionComplete() {
        if (this.hero.currentHealth > 0) {
            if (this.currentStep === CombatStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION) {
                this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION);
            } else if (this.currentStep === CombatStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION) {
                this.setState(CombatStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE);
            }
        } else {
            const enemyWins = true;
            console.log(`${this.enemy.name} wins by Knock Out!`);
            this.scene.events.emit("fightEnded", enemyWins);
        }
    }
}
