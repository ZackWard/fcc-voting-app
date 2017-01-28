// Import promise/fetch polyfills
import 'promise-polyfill';
import 'whatwg-fetch';

export const BEGIN_LOGIN = "BEGIN_LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGIN_TOKEN_EXPIRED = "LOGIN_TOKEN_EXPIRED";
export const LOGOUT = "LOGOUT";

export const BEGIN_REGISTER_USER = "BEGIN_REGISTER_USER";
export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";

export const SUBMIT_POLL_FORM = "SUBMIT_POLL_FORM";
export const SUBMIT_POLL_SUCCESS = "SUBMIT_POLL_SUCCESS";
export const SUBMIT_POLL_FAILURE = "SUBMIT_POLL_FAILURE";

export const BEGIN_RETRIEVE_POLLS = "BEGIN_RETRIEVE_POLLS";
export const RETRIEVE_POLLS_SUCCESS = "RETRIEVE_POLLS_SUCCESS";
export const RETRIEVE_POLLS_FAILURE = "RETRIEVE_POLLS_FAILURE";

export function doApiCall(url: string, body: any) {   
    let myInit = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    let myRequest = new Request(url, myInit);
    return fetch(myRequest);
}

export function submitPollForm(poll) {
    return function (dispatch) {
        dispatch({
            type: SUBMIT_POLL_FORM,
            message: "Poll Form Submitted"
        });

        // Do API call here
        doApiCall('/api/polls', poll)
        .then((response) => {
            if (response.ok) {
                response.json().then(json => {
                    dispatch({
                        type: SUBMIT_POLL_SUCCESS,
                        message: json.message,
                        pollId: json.pollId
                    });
                });
            } else {
                response.json().then(json => {
                    dispatch({
                        type: SUBMIT_POLL_FAILURE,
                        error: json.error,
                        message: "Error saving form: " + json.error
                    });
                });
            }
        })
        .catch((e) => {
            dispatch({
                type: SUBMIT_POLL_FAILURE,
                message: "Error saving form!"
            });
        });
    };
}

export function beginRegister(userInfo) {
    return function (dispatch) {
        // First, update our state to reflect that we're registering a new user
        dispatch({
            type: BEGIN_REGISTER_USER,
            message: "Trying to register user with username " + userInfo.username + " and email " + userInfo.email
        });

        // Do API call here
        doApiCall('/api/register', {
                username: userInfo.username,
                email: userInfo.email,
                password: userInfo.password
        })
        .then((response) => {
            if (response.ok) {
                response.json().then(json => {
                    dispatch({
                        type: REGISTER_USER_SUCCESS,
                        message: "Registered user!"
                    });
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
        doApiCall('/api/login', {
            username: username,
            password: password
        })
        .then((response) => {
            if (response.ok) {
                response.json().then(json => {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        message: "Logged in!",
                        apiToken: json.apiToken,
                        user: username
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

export function doLogout() {
    return {
        type: LOGOUT,
        message: "Logged out"
    };
}

export function retrievePolls(polls: string[]) {
    return function (dispatch) {
        dispatch({
            type: BEGIN_RETRIEVE_POLLS,
            message: "Retrieving polls from server"
        });
        // Do API call
    };
}

export function tokenExpired() {
    return {
        type: LOGIN_TOKEN_EXPIRED,
        message: "Login Token Expired"
    };
}