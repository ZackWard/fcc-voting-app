import * as React from "react";
import { connect } from "react-redux";
import { retrievePollsByUser } from "../actions";
import { Spinner } from "../components/Spinner";
import { PollList } from "../components/PollList";
import { Poll } from "./Poll";

interface PollListByUserProps {
    params: {
        user: string
    },
    polls: any[],
    loading: boolean,
    retrievePollsByUser: (user: string) => any

}

interface PollListByUserState {

}

class PollListByUserComponent extends React.Component<PollListByUserProps, PollListByUserState> {

    constructor(props: PollListByUserProps) {
        super(props);
        props.retrievePollsByUser(props.params.user);
    }

    render() {

        if (this.props.loading) {
            return (
                <div className="container">
                    <Spinner />
                </div>    
            );
        }

        if (this.props.polls.length == 0) {
            return (
                <div className="container">
                    No polls found for user {this.props.params.user}.
                </div>
            );
        }

        let userPolls: any[] = this.props.polls.filter(poll => poll.username == this.props.params.user);

        return (
            <PollList polls={userPolls} />
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        polls: state.retrievedPolls
    };
};

const mapDispatchToProps = dispatch => {
    return {
        retrievePollsByUser: user => { dispatch(retrievePollsByUser(user)) }
    };
};

export const PollListByUser = connect(mapStateToProps, mapDispatchToProps)(PollListByUserComponent);