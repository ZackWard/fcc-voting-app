import * as React from "react";
import { connect } from "react-redux";
import { Nav } from "../containers/Nav";
import * as actions from "../actions";

interface VotingAppProps {
    retrievePolls: () => any
}

interface VotingAppState {

}

export class VotingAppComponent extends React.Component<VotingAppProps, VotingAppState> {

    constructor(props: VotingAppProps) {
        super(props);
        props.retrievePolls();
    }

    render() {
        return (
            <div>
                <Nav></Nav>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        retrievePolls: () => {
            dispatch(actions.retrievePolls());
        }
    };
};

export const VotingApp = connect(mapStateToProps, mapDispatchToProps)(VotingAppComponent);