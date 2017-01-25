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

export const SUBMIT_POLL_FORM = "SUBMIT_POLL_FORM";
export const SUBMIT_POLL_SUCCESS = "SUBMIT_POLL_SUCCESS";
export const SUBMIT_POLL_FAILURE = "SUBMIT_POLL_FAILURE";

export function submitPollForm(poll) {
    return function (dispatch) {
        dispatch({
            type: SUBMIT_POLL_FORM,
            message: "Poll Form Submitted"
        });

        // Modify the poll object to make sure that it's the right format for the database
        poll.responses = poll.responses.map(responseString => {
            return {
                response: responseString,
                votes: []
            };
        });


        // Do API call here
        let myInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "BLAH",
                question: poll.pollQuestion,
                responses: poll.responses
            })
        };
        let myRequest = new Request('/api/poll', myInit);
        fetch(myRequest)
            .then((response) => {
                if (response.ok) {
                    response.json().then(json => {
                        dispatch({
                            type: SUBMIT_POLL_SUCCESS,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: SUBMIT_POLL_FAILURE,
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