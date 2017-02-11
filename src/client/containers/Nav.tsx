import * as React from 'react';
import { connect } from "react-redux";
import * as actions from "../actions";
import { BootstrapLink } from "../components/BootstrapLink";
import { Link } from 'react-router';

interface NavProps {
    user: string | null,
    doLogout: () => void
}

const NavComponent = (props: NavProps) => {
    let loginOrRegister = [
        <BootstrapLink key="register" to="/register">Register</BootstrapLink>,
        <BootstrapLink key="login" to="/login">Login</BootstrapLink>
    ];
    let logOut = <li><a onClick={event => {event.preventDefault(); props.doLogout();}} href="#">Logout</a></li>;

    let loggedInUserLinks = [
        <BootstrapLink key="mypolls" to={"/users/" + props.user + "/polls"}>My Polls</BootstrapLink>,
        <BootstrapLink key="newpoll" to="/polls/new">New Poll</BootstrapLink>
    ];
    
    return (
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">Brand</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                        { props.user == null ? false : loggedInUserLinks }
                        <BootstrapLink to="/polls">Polls</BootstrapLink>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        { props.user == null ? loginOrRegister : logOut }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};
const mapDispatchToProps = {
    doLogout: actions.doLogout
};

export const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);