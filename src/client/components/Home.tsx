import * as React from "react";
import { Link } from "react-router";

interface HomeProps {

}

export const Home = (props: HomeProps) => {
    return (
        <div className="container">

            <div className="jumbotron text-center">
                <h1>freeCodeCamp Voting App</h1>
                <p className="lead">Thank you for helping me test out my voting app!</p>
                <p>
                    <div className="btn-group">
                        <Link to="/register" className="btn btn-lg btn-success" role="button">New Account</Link>
                        <Link to="/polls" className="btn btn-lg btn-success" role="button">Polls</Link>
                    </div>
                </p>
            </div>

            <footer className="footer">
                <p>&copy; 2017 Zack Ward</p>
            </footer>

        </div> 
    );
};