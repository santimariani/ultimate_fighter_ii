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
          // Round complete logic
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
      // Logic to determine who acts first
      this.setState(RoundStateMachine.ROUND_STEP_STATES.FIRST_ACTION);
    }
  
    firstAction() {
      // Logic for the first player's action
      this.setState(RoundStateMachine.ROUND_STEP_STATES.SECOND_ACTION);
    }
  
    secondAction() {
      // Logic for the second player's action
      this.setState(RoundStateMachine.ROUND_STEP_STATES.ROUND_COMPLETE);
    }
  }