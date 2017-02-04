import * as React from 'react';
import { connect } from "react-redux";
import * as actions from "../actions";
import { Link } from 'react-router';

interface NavProps {
    user: string | null,
    doLogout: () => void
}

const NavComponent = (props: NavProps) => {
    let loginOrRegister = [
        <li key="register"><Link to="/register">Register</Link></li>,
        <li key="login"><Link to="/login">Login</Link></li>
    ];
    let logOut = <li><a onClick={event => {event.preventDefault(); props.doLogout();}} href="#">Logout</a></li>;
    
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
                        <li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
                        <li><Link to="/polls">Polls</Link></li>
                        { 
                            window.localStorage.getItem('fcc-vote-app-user') != null && 
                            <li><Link to="/polls/new">New Poll</Link></li>
                        }
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        {
                            props.user == null ? loginOrRegister : logOut
                        }
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