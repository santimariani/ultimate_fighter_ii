export class FightStepsStateMachine {
    static ROUND_STEP_STATES = {
        DETERMINE_FIRST_ACTOR: "DETERMINE_FIRST_ACTOR",
        FIRST_ACTION: "FIRST_ACTION",
        SECOND_ACTION: "SECOND_ACTION",
        ROUND_COMPLETE: "ROUND_COMPLETE",
    };

    constructor(scene, hero, sean) {
        this.scene = scene;
        this.hero = hero;
        this.sean = sean;
        this.currentStep = null;
        this.firstActor = null;
        this.secondActor = null;
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
                console.log("Round Complete");
                this.scene.events.emit("roundComplete");
                break;
            default:
                console.log("FightStepsStepMachine default");
        }
    }

    update() {
        // Update logic for the current step
    }

    isRoundComplete() {
        return (
            this.currentStep ===
            FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
        );
    }

    determineFirstActor() {
        console.log("M determineFirstActor");
        let heroAgility, seanAgility;
        do {
            heroAgility = Phaser.Math.Between(1, this.hero.agility);
            seanAgility = Phaser.Math.Between(1, this.sean.agility);
        } while (heroAgility === seanAgility);

        if (heroAgility > seanAgility) {
            this.firstActor = "hero";
            this.secondActor = "sean";
            console.log("Hero goes first!");
        } else {
            this.firstActor = "sean";
            this.secondActor = "hero";
            console.log("Sean goes first!");
        }
        this.setState(FightStepsStateMachine.ROUND_STEP_STATES.FIRST_ACTION);
    }

    firstAction() {
        console.log("M first Action");
        if (this.firstActor === "hero") {
            console.log("Hero to take action");
            this.scene.events.emit("heroAction");
            this.scene.events.once("heroActionComplete", () => {
                console.log("Hero has acted. Now the enemy takes his turn.");
                this.setState(
                    FightStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
                );
            });
        } else {
            console.log("Enemy to take action");
            this.scene.events.emit("enemyAction");
            this.scene.events.once("enemyActionComplete", () => {
                console.log("Enemy has acted. Now the hero takes his turn.");
                this.setState(
                    FightStepsStateMachine.ROUND_STEP_STATES.SECOND_ACTION
                );
            });
        }
    }

    secondAction() {
        console.log("M secondAction");
        if (this.secondActor === "hero") {
            console.log("Hero goes next");
            this.scene.events.emit("heroAction");
            this.scene.events.once("heroActionComplete", () => {
                console.log("Hero has acted. Round is complete.");
                this.setState(
                    FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
                );
            });
        } else {
            console.log("Enemy goes next");
            this.scene.events.emit("enemyAction");
            this.scene.events.once("enemyActionComplete", () => {
                console.log("Enemy has acted. Round is complete.");
                this.setState(
                    FightStepsStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE
                );
            });
        }
    }
}

