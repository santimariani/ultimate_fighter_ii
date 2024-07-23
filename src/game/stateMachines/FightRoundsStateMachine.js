import { CombatStepsStateMachine } from "./CombatStepsStateMachine";
import { Scene } from "phaser";

export class FightRoundsStateMachine {
    static ROUND_STATES = {
        START: "START",
        ROUND_IN_PROGRESS: "ROUND_IN_PROGRESS",
        END: "END",
    };

    constructor(scene) {
        this.scene = scene;
        this.roundStateMachine = null;
        this.roundNumber = 1;
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
                console.log("FIGHT BEGINS!");
                this.roundNumber = 1;
                this.scene.events.emit("roundChanged", this.roundNumber);
                this.setState(FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS);
                break;
            case FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS:
                if (this.roundNumber <= this.maxRounds) {
                    console.log("—ROUND", this.roundNumber, "—");
                    this.scene.events.emit("roundChanged", this.roundNumber);
                    this.roundStateMachine = new CombatStepsStateMachine(
                        this.scene,
                        this.hero,
                        this.enemy
                    );
                    this.roundStateMachine.startRound();
                    this.roundNumber++;
                } else {
                    this.setState(FightRoundsStateMachine.ROUND_STATES.END);
                    this.endFight(true, null);
                }
                break;
            case FightRoundsStateMachine.ROUND_STATES.END:
                console.log("END OF FIGHT!");
                break;
        }
    }

    update() {
        if (this.currentState === FightRoundsStateMachine.ROUND_STATES.END) {
            return;
        }

        if (this.hero.currentHealth <= 0 || this.enemy.currentHealth <= 0) {
            const tie = false;
            const winner = this.hero.currentHealth > 0 ? "hero" : "enemy";
            this.setState(FightRoundsStateMachine.ROUND_STATES.END);
            this.endFight(tie, winner);
            return;
        }

        if (this.roundStateMachine) {
            this.roundStateMachine.update();
            if (this.roundStateMachine.isRoundComplete()) {
                this.setState(FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS);
            }
        }
    }

    endFight(tie, winner) {
        this.scene.events.emit("fightEnded", { tie, winner });
    }
}
