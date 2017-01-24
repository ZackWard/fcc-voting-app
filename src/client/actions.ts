// Import promise/fetch polyfills
import 'promise-polyfill';
import 'whatwg-fetch';

export const BEGIN_LOGIN = "BEGIN_LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGIN_TOKEN_EXPIRED = "LOGIN_TOKEN_EXPIRED";
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
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: REGISTER_USER_FAILURE,
                            message: "Error registering user: " + json.error
                        });
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

export function beginLogin(username: string, password: string) {
    return function (dispatch) {
        dispatch({
            type: BEGIN_LOGIN,
            message: "Begin Login"
        });

        // Do API call here
        let myInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        };
        let myRequest = new Request('/api/login', myInit);
        fetch(myRequest)
            .then((response) => {
                if (response.ok) {
                    response.json().then(json => {
                        dispatch({
                            type: LOGIN_SUCCESS,
                            message: "Logged in!",
                            apiToken: json.apiToken
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: LOGIN_FAILURE,
                            message: json.error
                        });
                    });
                }
            })
            .catch((e) => {
                dispatch({
                    type: LOGIN_FAILURE,
                    message: "Error logging in!"
                });
            });      
    };
}

export function tokenExpired() {
    return {
        type: LOGIN_TOKEN_EXPIRED,
        message: "Login Token Expired"
    };
}