export class FightStepsStateMachine {
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

        // Bind the event listeners
        this.handleHeroActionComplete =
            this.handleHeroActionComplete.bind(this);
        this.handleEnemyActionComplete =
            this.handleEnemyActionComplete.bind(this);
    }

    startRound() {
        this.setState(
            FightStepsStateMachine.ROUND_STEP_STATES.DETERMINE_FIRST_ACTOR
        );
    }

    setState(state) {
        this.currentStep = state;
        switch (state) {
            case FightStepsStateMachine.ROUND_STEP_STATES.DETERMINE_FIRST_ACTOR:
                this.determineFirstActor();
                break;
            case FightStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION:
                this.firstAction();
                break;
            case FightStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION:
                this.secondAction();
                break;
            case FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE:
                console.log("ROUND COMPLETE");
                // Emit an event to signal that the round is complete
                this.scene.events.emit("roundComplete");
                break;
        }
    }

    update() {
        if (
            this.currentStep ===
            FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
        ) {
            return true;
        }
    }

    isRoundComplete() {
        return (
            this.currentStep ===
            FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
        );
    }

    determineFirstActor() {
        let heroAgility, enemyAgility;
        do {
            heroAgility = Phaser.Math.Between(1, this.hero.agility);
            console.log(`Hero initiative score:" ${heroAgility}`)
            enemyAgility = Phaser.Math.Between(1, this.enemy.agility);
            console.log(`Enemy initiative score:" ${enemyAgility}`)
        } while (heroAgility === enemyAgility);

        if (heroAgility > enemyAgility) {
            this.firstActor = "hero";
            this.secondActor = "enemy";
            console.log("Hero takes the initiative!");
        } else {
            this.firstActor = "enemy";
            this.secondActor = "hero";
            console.log("Enemy takes the initiative!");
        }
        this.setState(FightStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION);
    }

    firstAction() {
        if (this.firstActor === "hero") {
            this.scene.events.emit("heroAction");
            this.scene.events.once(
                "heroActionComplete",
                this.handleHeroActionComplete);
        }
        if (this.firstActor === "enemy") {
            this.scene.events.emit("enemyAction");
            console.log("HERO GOES NEXT");
            this.scene.events.once(
                "enemyActionComplete",
                this.handleEnemyActionComplete);
        }
    }

    secondAction() {
        if (this.secondActor === "hero") {
            this.scene.events.emit("heroAction");
            this.scene.events.once(
                "heroActionComplete",
                this.handleHeroActionComplete
            );
        }
        if (this.secondActor === "enemy") {
            this.scene.events.emit("enemyAction");
            this.scene.events.once(
                "enemyActionComplete",
                this.handleEnemyActionComplete
            );
        }
    }

    handleHeroActionComplete() {
        if (
            this.currentStep ===
            FightStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION
        ) {
            this.setState(
                FightStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
            );
        } else if (
            this.currentStep ===
            FightStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
        ) {
            this.setState(
                FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
            );
        }
    }

    handleEnemyActionComplete() {
        if (
            this.currentStep ===
            FightStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION
        ) {
            this.setState(
                FightStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
            );
        } else if (
            this.currentStep ===
            FightStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
        ) {
            this.setState(
                FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
            );
        }
    }
}

