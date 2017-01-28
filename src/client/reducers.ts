import * as actions from './actions';

// Import react router history so that we can navigate programmatically.
import { browserHistory } from "react-router";

interface pollFormState {
    error: string | null
}

interface appState {
    user: string | null,
    pollForm: pollFormState,
    registerUserError?: string;
}

const initialState: appState = {
    user: window.localStorage.getItem('fcc-vote-app-user') == null ? null : window.localStorage.getItem('fcc-vote-app-user'),
    pollForm: {
        error: null
    }
};

export const reducer = (state = initialState, action) => {
    // Make a copy of state
    let newState = JSON.parse(JSON.stringify(state));

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
        default: 
            return newState;
    }
};