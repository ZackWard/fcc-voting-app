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
    retrievePoll: (pollId: number) => any,
    castVote: (poll: number, response: number) => any
}

interface SinglePollViewState {
    id: number,
    question: string,
    responses: any[],
    retrieveAttempted: boolean
}

class SinglePollViewComponent extends React.Component<SinglePollViewProps, SinglePollViewState> {

    constructor(props: SinglePollViewProps) {
        super(props);
        this.getDerivedState = this.getDerivedState.bind(this);
        this.state = this.getDerivedState(props);
    }

    componentWillReceiveProps(nextProps: SinglePollViewProps) {
        this.setState(this.getDerivedState(nextProps));
    }

    getDerivedState(props: SinglePollViewProps): SinglePollViewState {
        var singlePoll: SinglePollViewState = {
            id: 0,
            question: props.loading ? "Loading..." : "Poll not found",
            responses: [],
            retrieveAttempted: this.state == undefined ? false : this.state.retrieveAttempted
        };

        let found: boolean = false;

        for (let i: number = 0; i < props.polls.length; i++) {
            if (props.params.pollId == props.polls[i].poll_id) {
                found = true;
                singlePoll.id = props.polls[i].poll_id;
                singlePoll.question = props.polls[i].question;
                singlePoll.responses = props.polls[i].responses;
            }
        }

        if ( ! found && ! props.loading && ! singlePoll.retrieveAttempted) {
            // The poll that we're looking for isn't loaded. Try to load it from the server
            this.props.retrievePoll(props.params.pollId);
            singlePoll.retrieveAttempted = true;
        }

        return singlePoll;
    }

    render() {
        return (
            <div className="container">
                <Poll id={this.props.params.pollId} question={this.state.question} responses={this.state.responses} voteHandler={this.props.castVote}></Poll>
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
        retrievePoll: (pollId: number) => { dispatch(retrievePoll(pollId)) },
        castVote: (poll: number, response: number) => { dispatch(castVote(poll, response)) }
    };
};

export const SinglePollView = connect(mapStateToProps, mapDispatchToProps)(SinglePollViewComponent);