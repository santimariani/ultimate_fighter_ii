import { EventBus } from "../EventBus";

export class RoundStateMachine {
    static ROUND_STEP_STATES = {
      DETERMINE_FIRST_ACTOR: 'DETERMINE_FIRST_ACTOR',
      FIRST_ACTION: 'FIRST_ACTION',
      SECOND_ACTION: 'SECOND_ACTION',
      ROUND_COMPLETE: 'ROUND_COMPLETE',
    };
  
    constructor(scene) {
      this.scene = scene;
      this.currentStep = null;
    }
  
    startRound() {
      this.setState(RoundStateMachine.ROUND_STEP_STATES.DETERMINE_FIRST_ACTOR);
    }
  
    setState(state) {
      this.currentStep = state;
      switch (state) {
        case RoundStateMachine.ROUND_STEP_STATES.DETERMINE_FIRST_ACTOR:
          this.determineFirstActor();
          break;
        case RoundStateMachine.ROUND_STEP_STATES.FIRST_ACTION:
          this.firstAction();
          break;
        case RoundStateMachine.ROUND_STEP_STATES.SECOND_ACTION:
          this.secondAction();
          break;
        case RoundStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE:
          break;
      }
    }
  
    update() {
      if (this.currentStep === RoundStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE) {
        return true;
      }
      // Update logic for the current step
    }
  
    isRoundComplete() {
      return this.currentStep === RoundStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE;
    }
  
    determineFirstActor() {
      console.log('first actor chosen')
      this.setState(RoundStateMachine.ROUND_STEP_STATES.FIRST_ACTION);
    }
  
    firstAction() {
      console.log('first action taken')
      this.setState(RoundStateMachine.ROUND_STEP_STATES.SECOND_ACTION);
    }
  
    secondAction() {
      console.log('second action chosen')
      this.setState(RoundStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE);
    }
  }