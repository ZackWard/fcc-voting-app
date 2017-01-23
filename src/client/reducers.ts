import * as actions from './actions';

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
        case actions.BEGIN_LOGIN:
            console.log(action.message);
            return newState;
        case actions.LOGIN_SUCCESS: 
            console.log(action.message);
            newState.user = "Some User";
            return newState;
        case actions.LOGIN_FAILURE: 
            console.log(action.message);
            return newState;
        case actions.BEGIN_REGISTER_USER:
            console.log(action.message);
            return newState;
        case actions.REGISTER_USER_SUCCESS:
            console.log(action.message);
            return newState;
        case actions.REGISTER_USER_FAILURE:
            console.log(action.message);
            return newState;
        default: 
            return newState;
    }
};