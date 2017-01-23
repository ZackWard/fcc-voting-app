import { connect } from "react-redux";
import { RegisterUserForm } from "../components/RegisterUserForm";
import * as actions from "../actions";


const mapDispatchToProps = (dispatch) => {
    return {
        onRegister: (userInfo) => { dispatch(actions.beginRegister(userInfo)) }
    };
};

export const RegisterUserFormContainer = connect(null, mapDispatchToProps)(RegisterUserForm);