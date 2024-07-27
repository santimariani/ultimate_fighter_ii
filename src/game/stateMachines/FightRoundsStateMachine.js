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
        this.maxRounds = 2;
        this.currentState = null;
        this.hero = this.scene.registry.get("hero");
        this.enemy = this.scene.registry.get("enemy");
        this.roundOut = false;
        this.knockOut = null;
    }

    start() {
        this.setState(FightRoundsStateMachine.ROUND_STATES.START);
    }

    setState(state) {
        this.currentState = state;
        switch (state) {
            case FightRoundsStateMachine.ROUND_STATES.START:
                this.roundNumber;
                this.setState(
                    FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS
                );
                break;
            case FightRoundsStateMachine.ROUND_STATES.ROUND_IN_PROGRESS:
                if (this.roundNumber <= this.maxRounds) {
                    this.scene.updatePopupText(`— ROUND ${this.roundNumber} —`);
                    this.scene.events.emit("roundChanged", this.roundNumber);
                    this.roundStateMachine = new CombatStepsStateMachine(
                        this.scene,
                        this.hero,
                        this.enemy
                    );
                    this.scene.time.delayedCall(1500, () => {
                        this.roundStateMachine.startRound();
                        this.roundNumber++;
                    });
                } else {
                    this.setState(FightRoundsStateMachine.ROUND_STATES.END);
                    this.endFight(true, null);
                }
                break;
                case FightRoundsStateMachine.ROUND_STATES.END:
                    let endText;
                    if (typeof this.knockOut === 'string' && this.knockOut) {
                        const winner =
                            this.knockOut === "hero"
                                ? this.hero.name
                                : this.enemy.name;
                        const loser =
                            this.knockOut === "hero"
                                ? this.enemy.name
                                : this.hero.name;
                        endText = `${loser} was \nknocked out \nby ${winner}!\n\nEND OF FIGHT`;
                    } else if (this.roundOut) {
                        endText = `No more rounds!\n\nEND OF FIGHT`;
                    } else {
                        endText = `END OF FIGHT!`;
                    }
                    this.scene.updatePopupText(endText);
                    this.scene.time.delayedCall(3000, () => {
                        this.endFight(this.roundOut, this.knockOut);
                    });
                    break;
        }
    }

    update() {
        if (this.currentState === FightRoundsStateMachine.ROUND_STATES.END) {
            return;
        }

        if (this.hero.currentHealth <= 0 || this.enemy.currentHealth <= 0) {
            this.knockOut = this.hero.currentHealth > 0 ? "hero" : "enemy";
            this.setState(FightRoundsStateMachine.ROUND_STATES.END);
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

    endFight(roundOut, knockOut) {
        console.log("endFight called with roundOut:", roundOut);
        console.log("endFight called with knockOut:", knockOut);
        this.scene.events.emit("fightEnded", { roundOut, knockOut });
    }
}

