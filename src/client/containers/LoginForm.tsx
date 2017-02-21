import * as React from "react";
import { connect } from "react-redux";
import { beginLogin } from "../actions";

interface LoginFormProps {
    onSubmitLogin: (username: string, password: string) => {},
    error?: string
}

interface LoginFormState {
    username?: string,
    password?: string
}

export class LoginFormComponent extends React.Component<LoginFormProps, LoginFormState> {

    constructor(props: LoginFormProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            username: '',
            password: ''
        };
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmitLogin(this.state.username, this.state.password);
    }

    render() {
        return (
            <form>
                <div className="container">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" name="username" onChange={this.handleChange} value={this.state.username} placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" />
                    </div>
                    { this.props.error && <div className="alert alert-danger" role="alert">{this.props.error}</div> }
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Log In</button>
                </div>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.loginError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmitLogin: (username: string, password: string) => { dispatch(beginLogin(username, password)); }
    };
};

export const LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginFormComponent);