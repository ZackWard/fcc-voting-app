import * as React from "react";
import { connect } from "react-redux";
import { castVote } from "../actions";
import { Poll } from "../components/Poll";

interface PollListProps {
    polls: any[],
    loading: boolean,
    castVote: (poll: number, response: number) => any
}

interface PollResponse {
    response: string,
    votes: number,
}

interface PollListState {
    id: number,
    question: string,
    responses: PollResponse[]
}

class PollListComponent extends React.Component<PollListProps, PollListState> {

    constructor(props: PollListProps) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return (
                <div className="container">
                    <h2>Loading...</h2>
                </div>
            );
        }

        return (
            <div className="container">
                <h1>All Polls</h1>
                {
                    this.props.polls.map(poll => {
                        return <Poll loading={this.props.loading} poll={poll} key={poll.poll_id} voteHandler={this.props.castVote}></Poll>
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        polls: state.retrievedPolls,
        loading: state.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        castVote: (poll: number, response: number) => { dispatch(castVote(poll, response)) }
    };
};

export const PollList = connect(mapStateToProps, mapDispatchToProps)(PollListComponent);