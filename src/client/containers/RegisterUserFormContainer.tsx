import { connect } from "react-redux";
import { RegisterUserForm } from "../components/RegisterUserForm";
import * as actions from "../actions";

const mapStateToProps = (state) => {
    let newProps: any = {};
    if (state.registerUserError !== undefined) {
        newProps.error = state.registerUserError;
    }
    return newProps;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRegister: (userInfo) => { dispatch(actions.beginRegister(userInfo)) }
    };
};

export const RegisterUserFormContainer = connect(mapStateToProps, mapDispatchToProps)(RegisterUserForm);