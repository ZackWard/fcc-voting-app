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
            browserHistory.push('/');
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
            // hashHistory.push('/polls');
            return newState;
        case actions.SUBMIT_POLL_FAILURE:
            console.log(action.message);
            newState.pollForm.error = action.error;
            return newState;
        case actions.BEGIN_RETRIEVE_POLLS:
            console.log(action.message);
            return newState;
        case actions.RETRIEVE_POLLS_SUCCESS:
            console.log(action.message);
            console.log(action.polls);
            newState.retrievedPolls = action.polls;
            return newState;
        case actions.RETRIEVE_POLLS_FAILURE:
            console.log(action.message);
            return newState;
        case actions.BEGIN_RETRIEVE_POLL:
            console.log(action.message);
            return newState;
        case actions.RETRIEVE_POLL_SUCCESS:
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
            console.log(action.message);
            return newState;
        default: 
            return newState;
    }
};