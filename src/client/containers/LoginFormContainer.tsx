import { LoginForm } from "../components/LoginForm";
import { beginLogin } from "../actions";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmitLogin: () => { dispatch(beginLogin()); }
    };
};

export const LoginFormContainer = connect(null, mapDispatchToProps)(LoginForm);