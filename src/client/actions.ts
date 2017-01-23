// Import promise/fetch polyfills
import 'promise-polyfill';
import 'whatwg-fetch';

export const BEGIN_LOGIN = "BEGIN_LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const BEGIN_REGISTER_USER = "BEGIN_REGISTER_USER";
export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";


export function beginRegister(userInfo) {
    return function (dispatch) {
        // First, update our state to reflect that we're registering a new user
        dispatch({
            type: BEGIN_REGISTER_USER,
            message: "Trying to register user with username " + userInfo.username + " and email " + userInfo.email
        });

        // Do API call here
        let myInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userInfo.username,
                email: userInfo.email,
                password: userInfo.password
            })
        };
        let myRequest = new Request('/api/register', myInit);
        fetch(myRequest)
            .then((response) => {
                if (response.ok) {
                    dispatch({
                        type: REGISTER_USER_SUCCESS,
                        message: "Registered user!"
                    });
                }
            })
            .catch((e) => {
                dispatch({
                    type: REGISTER_USER_FAILURE,
                    message: "Error registering user!"
                });
            });
    };
}

export function registerUserSuccess() {
    return {
        type: REGISTER_USER_SUCCESS,
        message: "User Registered"
    };
}

export function registerUserFailure() {
    return {
        type: REGISTER_USER_FAILURE,
        message: "Error registering user"
    };
}

export function beginLogin() {
    return function (dispatch) {
        dispatch({
            type: BEGIN_LOGIN,
            message: "Begin Login"
        });

        // Now, call the login api. We'll test it with a 1 second wait
        window.setTimeout(() => {
            dispatch({
                type: LOGIN_SUCCESS,
                message: "Logged in!"
            });
        }, 1000);
    };
}

export function loginSuccess() {
    return {
        type: LOGIN_SUCCESS,
        message: "Logged in!"
    };
}

export function loginFailure() {
    return {
        type: LOGIN_FAILURE,
        message: "Login Failed!"
    };
}