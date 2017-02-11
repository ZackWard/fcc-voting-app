import * as React from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import { Spinner } from "../components/Spinner";
import { PollToolBar } from "../components/PollToolbar";
import { PollResponses } from "../components/PollResponses";
import { PollResult } from "../components/PollResult";
import { editPoll, deletePoll, castVote, retrievePoll } from "../actions";
import * as d3 from "d3";

interface PollProps {
    id: number,
    polls: any[],
    user: string | boolean,
    loading: boolean,
    voteHandler: (poll: number, response: number) => any,
    editHandler: (poll: number) => any,
    deleteHandler: (poll: number) => any,
    retrievePoll: (poll: number) => any
}

interface PollState {
    retrievalAttempted: boolean,
    showResults: boolean
}

class PollComponent extends React.Component<PollProps, PollState> {

    panel: HTMLDivElement | null = null;

    constructor(props: PollProps) {
        super(props);

        this.findPoll = this.findPoll.bind(this);
        this.viewSinglePoll = this.viewSinglePoll.bind(this);
        this.toggleResults = this.toggleResults.bind(this);

        this.state = {
            retrievalAttempted: false,
            showResults: false
        };

    }

    componentDidMount() {
        // Check to make sure that the poll that we're trying to display has been retrieved. If not, dispatch 
        // an action to load it, unless we're currently loading a previous request
        if (this.findPoll() == false && this.props.loading == false) {
            this.props.retrievePoll(this.props.id);
        }
    }

    componentWillReceiveProps(nextProps: PollProps) {
        // The main reason for this function is to check to see if a previous request has finished, and we still don't have the poll that we want.
        // If the app is no longer loading a previous request, we don't have the poll we need, and we haven't already tried to retrieve it, 
        // try to retrieve it.
        if (this.props.loading == true && nextProps.loading == false && this.findPoll() == false && this.state.retrievalAttempted == false) {
            console.log("In Poll::componentWillReceiveProps: Trying to retrieve poll #" + this.props.id);
            this.props.retrievePoll(this.props.id);

            // Set this so that we don't go into an endless loop. Only attempt to retrieve the poll data once.
            this.setState({
                retrievalAttempted: true
            });
        }
    }

    viewSinglePoll(event) {
        event.preventDefault();
        let poll = this.findPoll();
        browserHistory.push('/polls/' + poll.poll_id);
    }

    toggleResults(event) {
        event.preventDefault();
        this.setState({
            retrievalAttempted: this.state.retrievalAttempted,
            showResults:  ! this.state.showResults
        });
    }

    findPoll() {
        let matchingPolls: any[] =  this.props.polls.filter(poll => poll.poll_id == this.props.id);
        if (matchingPolls.length == 0 || matchingPolls.length > 1) {
            return false;
        } else {
            return matchingPolls[0];
        }
    }

    render() {
        // Return early if loading, or if the poll hasn't been retrieved
        if (this.props.loading) {
            return (
                <div className="panel panel-default">
                    <div className="panel-body">
                        <Spinner />
                    </div>
                </div>
            );
        }

        if (this.findPoll() == false) {
            return (
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="alert alert-danger" role="alert"><b>Error:</b> Poll does not exist!</div>
                    </div>
                </div>
            );
        }

        let poll = this.findPoll();

        let panelHeading: any = <a href="#" onClick={this.viewSinglePoll}>{poll.question}</a>;

        let panelHeadingStyle = {
            display: "inline-block",
            width: "50%",
            overflow: "hidden"
        };

        let panelBody = ( poll.hasVoted || this.state.showResults ) ? <PollResult responses={poll.responses} /> : <PollResponses poll={poll} user={this.props.user} voteHandler={this.props.voteHandler} />;

        let panelToolbar = poll.username == this.props.user ?
            <PollToolBar poll={poll} editHandler={this.props.editHandler} deleteHandler={this.props.deleteHandler} /> : 
            <small>by: <a href="#" onClick={(e) => {e.preventDefault(); browserHistory.push('/users/' + poll.username + "/polls")}}>{poll.username}</a></small>;

        let showHide = this.state.showResults ? "Hide" : "Show";

        let panelFooter = poll.hasVoted ? false : <div className="text-right"><a href="#" onClick={this.toggleResults}>{showHide} Results</a></div>;

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title" style={panelHeadingStyle}>{panelHeading}</h3>
                    <div className="poll-toolbar pull-right">
                        { panelToolbar }
                    </div>
                </div>
                <div className="panel-body">
                    { panelBody }
                    { panelFooter }
                </div>
            </div>
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
        voteHandler: (poll: number, response: number) => { dispatch(castVote(poll, response)) },
        editHandler: (poll: number) => { dispatch(editPoll(poll)) },
        deleteHandler: (poll: number) => { dispatch(deletePoll(poll)) },
        retrievePoll: (poll: number) => { dispatch(retrievePoll(poll)) }
    };
};

export const Poll = connect(mapStateToProps, mapDispatchToProps)(PollComponent);