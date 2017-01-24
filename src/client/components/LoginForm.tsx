import * as React from "react";

interface LoginFormProps {
    onSubmitLogin: (username: string, password: string) => {}
}

interface LoginFormState {
    username?: string,
    password?: string
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState> {

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
        this.setState({
            username: '',
            password: ''
        });
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
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Log In</button>
                </div>
            </form>
        );
    }
}