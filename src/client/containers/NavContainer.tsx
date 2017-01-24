import { connect } from 'react-redux';
import { Nav } from "../components/Nav";

const mapStateToProps = (state) => {
    return {
        token: state.apiToken
    };
};

export const NavContainer = connect(mapStateToProps)(Nav);