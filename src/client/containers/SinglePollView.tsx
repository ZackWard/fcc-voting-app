import * as React from "react";
import { connect } from "react-redux";
import { Poll } from "../components/Poll";
import { retrievePoll, castVote } from "../actions";

interface SinglePollViewProps {
    params: {
        pollId: number
    }
    polls: any[],
    loading: boolean,
    castVote: (poll: number, response: number) => any
}

interface SinglePollViewState {
    
}

class SinglePollViewComponent extends React.Component<SinglePollViewProps, SinglePollViewState> {

    constructor(props: SinglePollViewProps) {
        super(props);
    }

    render() {
        let pollIndex: number | null = null;
        for (let i: number = 0; i < this.props.polls.length; i++) {
            if (this.props.polls[i].poll_id == this.props.params.pollId) {
                pollIndex = i;
            }
        }
        let pollElement;
        if (this.props.loading) {
            pollElement = <Poll loading={this.props.loading} poll={null} voteHandler={this.props.castVote}></Poll>
        } else {
            pollElement = <Poll loading={this.props.loading} poll={this.props.polls[pollIndex]} voteHandler={this.props.castVote}></Poll>
        }
        
        return (
            <div className="container">
                { pollElement }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        polls: state.retrievedPolls,
        loading: state.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        castVote: (poll: number, response: number) => { dispatch(castVote(poll, response)) }
    };
};

export const SinglePollView = connect(mapStateToProps, mapDispatchToProps)(SinglePollViewComponent);