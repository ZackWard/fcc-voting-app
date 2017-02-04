import * as React from "react";
import { connect } from "react-redux";
import { Poll } from "../components/Poll";
import { castVote, editPoll, deletePoll } from "../actions";

interface PollContainerProps {
    id: number,
    polls: any[],
    loading: boolean,
    user: string | null,
    handleEdit: (poll: number) => any,
    handleDelete: (poll: number) => any,
    handleVote: (poll: number, response: number) => any
}

interface PollContainerState {

}

class PollContainerComponent extends React.Component<PollContainerProps, PollContainerState> {

    constructor(props: PollContainerProps) {
        super(props);
    }

    render() {

        let pollIndex: null | number = null;
        this.props.polls.forEach((poll, index) => {
            if (poll.poll_id == this.props.id) {
                pollIndex = index;
            }
        });

        if (pollIndex == null) {
            return (
                <p>Error. Poll not found</p>
            );
        }

        let poll = this.props.polls[pollIndex];

        return (
            <Poll 
                loading={this.props.loading} 
                editable={this.props.user == poll.username} 
                poll={poll} 
                deleteHandler={this.props.handleDelete} 
                editHandler={this.props.handleEdit} 
                voteHandler={this.props.handleVote} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        user: state.user,
        polls: state.retrievedPolls
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleVote: (poll: number, response: number) => { dispatch(castVote(poll, response)) },
        handleEdit: (poll: number) => { dispatch(editPoll(poll)) },
        handleDelete: (poll: number) => { dispatch(deletePoll(poll)) }
    };
};

export const PollContainer = connect(mapStateToProps, mapDispatchToProps)(PollContainerComponent);