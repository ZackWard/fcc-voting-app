import * as React from "react";

interface LoginFormProps {
    onSubmitLogin: () => {}
}

export const LoginForm = (props: LoginFormProps) => {
    return (
        <form>
            <div className="container">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username" placeholder="Username" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary" onClick={(e) => {e.preventDefault(); props.onSubmitLogin();}}>Log In</button>
            </div>
        </form>
    );
};