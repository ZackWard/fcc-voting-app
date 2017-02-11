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
                <h3>Thank you for helping me test out my voting app. To get started, see what polls have already been created. You can also create an account and make your own polls.</h3>
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