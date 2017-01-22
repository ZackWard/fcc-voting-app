export const BEGIN_LOGIN = "BEGIN_LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export function beginLogin() {
    return function (dispatch) {
        dispatch({
            type: BEGIN_LOGIN,
            message: "Begin Login"
        });

        // Now, call the login api. We'll test it with a 5 second wait
        window.setTimeout(() => {
            dispatch({
                type: LOGIN_SUCCESS,
                message: "Logged in!"
            });
        }, 5000);
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