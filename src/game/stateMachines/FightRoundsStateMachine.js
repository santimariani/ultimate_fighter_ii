import { FightStepsStateMachine } from "./FightStepsStepMachine";

export class FightRoundsStateMachine {
    static ROUND_STATES = {
        START: "START",
        ROUND_IN_PROGRESS: "ROUND_IN_PROGRESS",
        END: "END",
    };

    constructor(scene) {
        this.scene = scene;
        this.roundStateMachine = null;
        this.roundNumber = 0;
        this.maxRounds = 10;
        this.currentState = null;
        this.hero = this.scene.registry.get("hero");
        this.enemy = this.scene.registry.get("enemy");
    }

    start() {
        this.setState(FightRoundsStateMachine.ROUND_STATES.START);
    }

    setState(state) {
        this.currentState = state;
        switch (state) {
            case FightRoundsStateMachine.ROUND_STATES.START:
                this.roundNumber = 0;
                this.setState(
                    FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS
                );
                break;
            case FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS:
                if (this.roundNumber < this.maxRounds) {
                    this.roundNumber++;
                    this.roundStateMachine = new FightStepsStateMachine(
                        this.scene,
                        this.hero,
                        this.enemy
                    );
                    this.roundStateMachine.startRound();
                } else {
                    this.setState(FightRoundsStateMachine.ROUND_STATES.END);
                }
                break;
            case FightRoundsStateMachine.ROUND_STATES.END:
                console.log("Fight Ended");
                break;
        }
    }

    update() {
        if (this.currentState === FightRoundsStateMachine.ROUND_STATES.END) {
            return;
        }

        if (this.roundStateMachine) {
            this.roundStateMachine.update();
            if (this.roundStateMachine.isRoundComplete()) {
                this.setState(
                    FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS
                );
            }
        }
    }
}

