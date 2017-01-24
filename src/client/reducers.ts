import * as actions from './actions';

interface appState {
    apiToken?: string | null,
    registerUserError?: string;
}

const initialState: appState = {
    apiToken: window.localStorage.getItem('fcc-vote-app-api-key')
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
            newState.apiToken = action.apiToken;
            return newState;
        case actions.LOGIN_FAILURE: 
            console.log(action.message);
            return newState;
        case actions.BEGIN_REGISTER_USER:
            delete newState.registerUserError;
            console.log(action.message);
            return newState;
        case actions.REGISTER_USER_SUCCESS:
            console.log(action.message);
            return newState;
        case actions.REGISTER_USER_FAILURE:
            newState.registerUserError = action.message;
            console.log(action.message);
            return newState;
        default: 
            return newState;
    }
};