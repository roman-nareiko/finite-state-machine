class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(config) {
            this._config = config;
            this._transition_history = [];
            this._canceled_transitions = []
            this.reset();
        }
        else
            throw Error();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(state in this._config.states){
            if(this._state !== state){
                this._state = state;
                this._transition_history.push(state);
            }
        }
        else
            throw Error();
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if(this._config.states[this.getState()].transitions.hasOwnProperty(event)){
            let state = this._config.states[this.getState()].transitions[event];

            if(this._state !== state){
                this._state = state;
                this._transition_history.push(this._state);
                this._canceled_transitions = [];
            }
        }else{
            throw(new Error());
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._state = this._config.initial;
        this._transition_history.push(this._state);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = [];

        if(event === undefined){
            for(let state in this._config.states){
                states.push(state);
            }    
        }else{
            for(let state in this._config.states){
                if(this._config.states[state].transitions.hasOwnProperty(event))
                    states.push(state);
            } 
        }

        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this._transition_history.length > 1){
            let popped = this._transition_history.pop();
            this._state = this._transition_history[this._transition_history.length - 1];
            this._canceled_transitions.push(popped)

            return true;
        }else{
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this._canceled_transitions.length){
            this._state = this._canceled_transitions.pop();
            this._transition_history.push(this._state);

            return true;
        }else{
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._transition_history.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
