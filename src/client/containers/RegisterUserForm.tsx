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

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" name="username" onChange={this.handleChange} placeholder="Username" value={this.state.username}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={this.handleChange} placeholder="Email" value={this.state.email} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={this.handleChange} placeholder="Password" value={this.state.password} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="verify_password">Verify Password</label>
                        <input type="password" className="form-control" id="passwordVerification" name="passwordVerification" onChange={this.handleChange} placeholder="Password" value={this.state.passwordVerification} />
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