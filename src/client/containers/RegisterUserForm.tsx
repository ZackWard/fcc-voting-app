import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

interface RegisterUserFormProps {
    onRegister: (userInfo) => null,
    error?: string
}

interface RegisterUserFormState {
    username?: string,
    email?: string,
    password?: string,
    passwordVerification?: string,
    localError?: string
}

export class RegisterUserFormComponent extends React.Component<RegisterUserFormProps, RegisterUserFormState> {
    constructor(props: RegisterUserFormProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordVerification: ''
        };
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleRegister(event) {
        event.preventDefault();
        if (this.state.password !== this.state.passwordVerification) {
            this.setState({
                localError: "Passwords do not match!"
            });
            return;
        }
        var userInfo = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        };
        this.props.onRegister(userInfo);
        this.setState({});
    }

    render() {

        let usernameFieldAttrs: any = {}, emailFieldAttrs: any = {}, passwordFieldAttrs: any = {}, verifypwFieldAttrs: any = {};

        if (this.state.username.length > 0) {
            if (this.state.username.length < 4) {
                usernameFieldAttrs.className = "has-error has-feedback";
            } else {
                usernameFieldAttrs.className = "has-success has-feedback";
            }
        }

        if (this.state.email.length > 0) {
            if (this.state.email.length < 8) {
                emailFieldAttrs.className = "has-error has-feedback";
            } else {
                emailFieldAttrs.className = "has-success has-feedback";
            }
        }

        if (this.state.password.length > 0) {
            if (this.state.password.length < 8) {
                passwordFieldAttrs.className = "has-error has-feedback";
            } else {
                passwordFieldAttrs.className = "has-success has-feedback";
            }

            if (this.state.passwordVerification != this.state.password) {
                verifypwFieldAttrs.className = "has-error has-feedback";
            } else {
                verifypwFieldAttrs.className = "has-success has-feedback";
            }
        }

        let warningIcon = [
            <span key="warning" className="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true" />, 
            <span key="warning-sr" className="sr-only">(error)</span>
        ];

        let successIcon = [
            <span key="success" className="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true" />,
            <span key="success-sr" className="sr-only">(success)</span>
        ];

        let usernameIcon = (usernameFieldAttrs.className == "has-error has-feedback") ? warningIcon : (usernameFieldAttrs.className == "has-success has-feedback") ? successIcon : false;
        let emailIcon = (emailFieldAttrs.className == "has-error has-feedback") ? warningIcon : (emailFieldAttrs.className == "has-success has-feedback") ? successIcon : false;
        let passwordIcon = (passwordFieldAttrs.className == "has-error has-feedback") ? warningIcon : (passwordFieldAttrs.className == "has-success has-feedback") ? successIcon : false;
        let verifypwIcon = (verifypwFieldAttrs.className == "has-error has-feedback") ? warningIcon : (verifypwFieldAttrs.className == "has-success has-feedback") ? successIcon : false;


        return (
            <div className="container">
                <form>
                    <h1>New User</h1>

                    {this.props.error && 
                        <div className="alert alert-danger" role="alert">{this.props.error}</div>      
                    }

                    {this.state.localError && 
                        <div className="alert alert-danger" role="alert">{this.state.localError}</div>      
                    }

                    <div className="form-group" {...usernameFieldAttrs}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" name="username" aria-describedby="username-help" onChange={this.handleChange} placeholder="Username" value={this.state.username}/>
                        { usernameIcon }
                        <span id="username-help" className="help-block">Please choose a username that is at least 4 characters long</span>
                    </div>
                    <div className="form-group" {...emailFieldAttrs}>
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" id="email" name="email" aria-describedby="email-help" onChange={this.handleChange} placeholder="Email" value={this.state.email} />
                        { emailIcon }
                        <span id="email-help" className="help-block">Please enter your email address.</span>
                    </div>
                    <div className="form-group" {...passwordFieldAttrs}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" name="password" aria-describedby="password-help" onChange={this.handleChange} placeholder="Password" value={this.state.password} />
                        { passwordIcon }
                        <span id="password-help" className="help-block">Please choose a password that is at least 8 characters long</span>
                    </div>
                    <div className="form-group" {...verifypwFieldAttrs}>
                        <label htmlFor="verify_password">Verify Password</label>
                        <input type="password" className="form-control" id="passwordVerification" name="passwordVerification" aria-describedby="pwverify-help" onChange={this.handleChange} placeholder="Password" value={this.state.passwordVerification} />
                        { verifypwIcon }
                        <span id="pwverify-help" className="help-block">Please type your password again.</span>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={this.handleRegister}>Register</button>
                </form>
            </div>
        );
    }
}

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

export const RegisterUserForm = connect(mapStateToProps, mapDispatchToProps)(RegisterUserFormComponent);