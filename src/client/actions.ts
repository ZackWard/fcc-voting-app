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

export const BEGIN_RETRIEVE_POLL = "BEGIN_RETRIEVE_POLL";
export const RETRIEVE_POLL_SUCCESS = "RETRIEVE_POLL_SUCCESS";
export const RETRIEVE_POLL_FAILURE = "RETRIEVE_POLL_FAILURE";

export function doApiPost(url: string, body: any) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            method: "POST",
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            processData: false,
            data: JSON.stringify(body),
            success: (data: any, status: string) => { resolve(data) },
            error: (xhr: any, status: any, error: any) => { reject(status) }
        });
    });
}

export function doApiGet(url: string) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: (json, status) => resolve(json),
            error: error => reject(error)
        });
    });
}

export function submitPollForm(poll) {
    return function (dispatch) {
        dispatch({
            type: SUBMIT_POLL_FORM,
            message: "Poll Form Submitted"
        });

        // Do API call here
        doApiPost('/api/polls', poll)
        .then((json: any) => {
            dispatch({
                type: SUBMIT_POLL_SUCCESS,
                message: json.message,
                pollId: json.pollId
            });
        })
        .catch((json: any) => {
            dispatch({
                type: SUBMIT_POLL_FAILURE,
                error: json.error,
                message: "Error saving form: " + json.error
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
        doApiPost('/api/register', {
                username: userInfo.username,
                email: userInfo.email,
                password: userInfo.password
        })
        .then((response) => {
            dispatch({
                type: REGISTER_USER_SUCCESS,
                message: "Registered user!"
            });
        })
        .catch((json: any) => {
            dispatch({
                type: REGISTER_USER_FAILURE,
                message: "Error registering user: " + json.error
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
        doApiPost('/api/login', {
            username: username,
            password: password
        })
        .then((json: any) => {
            dispatch({
                type: LOGIN_SUCCESS,
                message: "Logged in!",
                apiToken: json.apiToken,
                user: username
            });
        })
        .catch((json) => {
            dispatch({
                type: LOGIN_FAILURE,
                message: json.error
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

export function retrievePoll(pollId: number) {
    return function (dispatch) {
        dispatch({
            type: BEGIN_RETRIEVE_POLL,
            message: "Attempting to retrieve poll #" + pollId
        });

        doApiGet('/api/polls/' + pollId)
        .then(poll => {
            console.log(poll);
            dispatch({
                type: RETRIEVE_POLL_SUCCESS,
                message: "Retrieved poll #" + pollId,
                poll: poll[0]
            });
        })
        .catch(error => {
            dispatch({
                type: RETRIEVE_POLL_FAILURE,
                message: "Unable to retrieve poll #" + pollId
            });
        });
    };
}

export function retrievePolls() {
    return function (dispatch) {
        dispatch({
            type: BEGIN_RETRIEVE_POLLS,
            message: "Retrieving polls from server"
        });
        
        // Do API call
        doApiGet('/api/polls')
        .then((response: any) => {
            dispatch({
                type: RETRIEVE_POLLS_SUCCESS,
                message: "Retrieved all polls!",
                polls: response
            });
        })
        .catch((error: any) => {
            dispatch({
                type: RETRIEVE_POLLS_FAILURE,
                message: "Unable to retrieve polls!"
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