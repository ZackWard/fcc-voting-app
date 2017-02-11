import * as React from "react";
import { connect } from "react-redux";
import { PollList } from "../components/PollList";

interface PollListViewProps {
    polls: any[]
}

interface PollListViewState {

}

class PollListViewComponent extends React.Component<PollListViewProps, PollListViewState> { 
    
    constructor(props: PollListViewProps) {
        super(props);
    }

    render() {
        return (
            <PollList polls={this.props.polls}/>
        );
    }
};

const mapStateToProps = state => {
    return {
        polls: state.retrievedPolls
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export const PollListView = connect(mapStateToProps, mapDispatchToProps)(PollListViewComponent);