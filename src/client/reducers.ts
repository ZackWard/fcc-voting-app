import { LOGIN_SUCCESS, LOGIN_FAILURE, BEGIN_LOGIN, beginLogin, loginSuccess, loginFailure } from './actions';

interface appState {
    user: null | string
}

const initialState: appState = {
    user: null
};

export const reducer = (state = initialState, action) => {
    // Make a copy of state
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case BEGIN_LOGIN:
            console.log(action.message);
            return newState;
        case LOGIN_SUCCESS: 
            console.log(action.message);
            newState.user = "Some User";
            return newState;
        case LOGIN_FAILURE: 
            console.log(action.message);
            return newState;
        default: 
            return newState;
    }
};