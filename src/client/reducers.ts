import * as actions from './actions';

// Import react router history so that we can navigate programmatically.
import { browserHistory } from "react-router";

// Import our interfaces
import { appState } from "./interfaces";

const initialState: appState = {
    user: window.localStorage.getItem('fcc-vote-app-user') == null ? null : window.localStorage.getItem('fcc-vote-app-user'),
    pollForm: {
        error: null
    },
    loading: false,
    retrievedPolls: []
};



export const reducer = (state = initialState, action) => {
    // Make a copy of state
    let newState: appState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case actions.BEGIN_LOGIN:
            console.log(action.message);
            return newState;
        case actions.LOGIN_SUCCESS: 
            console.log(action.message);
            window.localStorage.setItem('fcc-vote-app-api-key', action.apiToken);
            window.localStorage.setItem('fcc-vote-app-user', action.user);
            newState.user = action.user;
            browserHistory.push('/polls');
            return newState;
        case actions.LOGIN_FAILURE: 
            console.log(action.message);
            return newState;
        case actions.LOGOUT:
            console.log(action.message);
            window.localStorage.removeItem('fcc-vote-app-api-key');
            window.localStorage.removeItem('fcc-vote-app-user');
            newState.user = null;
            return newState;
        case actions.BEGIN_REGISTER_USER:
            delete newState.registerUserError;
            console.log(action.message);
            return newState;
        case actions.REGISTER_USER_SUCCESS:
            console.log(action.message);
            browserHistory.push('/');
            return newState;
        case actions.REGISTER_USER_FAILURE:
            newState.registerUserError = action.message;
            console.log(action.message);
            return newState;
        case actions.SUBMIT_POLL_FORM:
            console.log(action.message);
            return newState;
        case actions.SUBMIT_POLL_SUCCESS:
            console.log(action.message);
            console.log("Poll ID: " + action.pollId);
            browserHistory.push('/polls');
            return newState;
        case actions.SUBMIT_POLL_FAILURE:
            console.log(action.message);
            newState.pollForm.error = action.error;
            return newState;
        case actions.BEGIN_RETRIEVE_POLLS:
            newState.loading = true;
            console.log(action.message);
            return newState;
        case actions.RETRIEVE_POLLS_SUCCESS:
            newState.loading = false;
            console.log(action.message);
            console.log(action.polls);
            newState.retrievedPolls = action.polls;
            return newState;
        case actions.RETRIEVE_POLLS_FAILURE:
            newState.loading = false;
            console.log(action.message);
            return newState;
        case actions.BEGIN_RETRIEVE_POLL:
            newState.loading = true;
            console.log(action.message);
            return newState;
        case actions.RETRIEVE_POLL_SUCCESS:
            newState.loading = false;
            // We have a new poll, merge it into the retrievedPolls array
            var existingPoll: number | null = null;
            newState.retrievedPolls.forEach((poll, index) => {
                if (poll.poll_id == action.poll.poll_id) {
                    existingPoll = index;
                }
            });
            if (existingPoll == null) {
                newState.retrievedPolls.push(action.poll);
            } else {
                console.log("Replacing existing poll in retrievedPolls with newly retrieved poll #" + action.poll.poll_id);
                newState.retrievedPolls[existingPoll] = action.poll;
            }
            console.log(action.message);
            return newState;
        case actions.RETRIEVE_POLL_FAILURE:
            newState.loading = false;
            console.log(action.message);
            return newState;
        case actions.BEGIN_CAST_VOTE:
            console.log(action.message);
            return newState;
        case actions.CAST_VOTE_SUCCESS:
            console.log(action.message);
            console.log(action.poll);
            let replacedExistingPoll = false;
            for (let i: number = 0; i < newState.retrievedPolls.length; i++) {
                if (newState.retrievedPolls[i].poll_id == action.poll.poll_id) {
                    newState.retrievedPolls[i] = action.poll;
                    replacedExistingPoll = true;
                }
            }
            if ( ! replacedExistingPoll ) {
                newState.retrievedPolls.push(action.poll);
            }
            return newState;
        case actions.CAST_VOTE_FAILURE:
            console.log(action.message);
            return newState;
        default: 
            console.log("In reducer, default action:");
            console.log("Action: " + action.type);
            console.log("Message: " + action.message);
            return newState;
    }
};