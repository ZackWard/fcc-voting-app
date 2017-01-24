import { LoginForm } from "../components/LoginForm";
import { beginLogin } from "../actions";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmitLogin: (username: string, password: string) => { dispatch(beginLogin(username, password)); }
    };
};

export const LoginFormContainer = connect(null, mapDispatchToProps)(LoginForm);