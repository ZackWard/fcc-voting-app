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

const mergePolls = (polls: any[], pollsToMerge: any[]) => {

    let currentPolls = polls.slice(0);
    let newPolls = pollsToMerge.slice(0);

    if (currentPolls.length == 0) {
        return newPolls;
    }
    
    let result = [];
    
    for (let i: number = 0; i < currentPolls.length; i++) {
        let pollUpdated = false;
        for (let j: number = 0; j < newPolls.length; j++) {
            if (currentPolls[i].poll_id == newPolls[j].poll_id) {
                result.push(newPolls[j]);
                newPolls.splice(j, 1);
                pollUpdated = true;
            }
        }
        if (!pollUpdated) {
            result.push(currentPolls[i]);
        }
    }

    for (let i: number = 0; i < newPolls.length; i++) {
        result.unshift(newPolls[i]);
    }

    return result;
}

export const reducer = (state = initialState, action) => {
    // Make a copy of state
    let newState: appState = JSON.parse(JSON.stringify(state));

    switch (action.type) {

        case actions.LOGIN_SUCCESS: 
            console.log(action.message);
            window.localStorage.setItem('fcc-vote-app-api-key', action.apiToken);
            window.localStorage.setItem('fcc-vote-app-user', action.user);
            newState.user = action.user;
            browserHistory.push('/polls');
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

        case actions.SUBMIT_POLL_SUCCESS:
            console.log(action.message);
            console.log("Added poll!");
            console.log(action.poll);
            newState.retrievedPolls = mergePolls(state.retrievedPolls, [action.poll]);
            console.log(newState.retrievedPolls);
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
            newState.retrievedPolls = mergePolls(state.retrievedPolls, action.polls);
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
            newState.retrievedPolls = mergePolls(state.retrievedPolls, action.poll);
            console.log(action.message);
            return newState;

        case actions.RETRIEVE_POLL_FAILURE:
            newState.loading = false;
            console.log(action.message);
            return newState;

        case actions.CAST_VOTE_SUCCESS:
            console.log(action.message);
            console.log(action.poll);
            newState.retrievedPolls = mergePolls(state.retrievedPolls, [action.poll]);
            return newState;

        case actions.GET_POLLS_BY_USER:
            newState.loading = true;
            console.log(action.message);
            return newState;

        case actions.GET_POLLS_BY_USER_SUCCESS:
            console.log(action.message);
            console.log(action.polls);
            newState.retrievedPolls = mergePolls(state.retrievedPolls, action.polls);
            newState.loading = false;
            return newState;

        case actions.GET_POLLS_BY_USER_FAILURE:
            newState.loading = false;
            console.log("Error");
            console.log(action.message);
            return newState;

        case actions.DELETE_POLL_SUCCESS: 
            newState.retrievedPolls = newState.retrievedPolls.filter(poll => poll.poll_id != action.pollId);
            console.log("Deleted poll #" + action.pollId);
            return newState;
            
        default: 
            console.log("In reducer, default action:");
            console.log("Action: " + action.type);
            console.log("Message: " + action.message);
            return newState;
    }
};