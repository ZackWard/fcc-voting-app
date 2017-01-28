import * as React from "react";
import { connect } from "react-redux";
import { Nav } from "../containers/Nav";

interface VotingAppProps {

}

interface VotingAppState {

}

export class VotingAppComponent extends React.Component<VotingAppProps, VotingAppState> {

    constructor(props: VotingAppProps) {
        super(props);
    }

    componentWillMount() {

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
    return {};
};

export const VotingApp = connect(mapStateToProps, mapDispatchToProps)(VotingAppComponent);