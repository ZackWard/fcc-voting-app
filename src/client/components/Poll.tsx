import * as React from "react";
import { browserHistory } from "react-router";
import { Spinner } from "./Spinner";
import { PollToolBar } from "./PollToolbar";
import { PollResponses } from "./PollResponses";
import { PollResult } from "./PollResult";
import * as d3 from "d3";

interface PollProps {
    poll: any,
    loading: boolean,
    editable: boolean,
    voteHandler: (poll: number, response: number) => any,
    editHandler: (poll: number) => any,
    deleteHandler: (poll: number) => any
}

interface PollState {
    
}

export class Poll extends React.Component<PollProps, PollState> {

    constructor(props: PollProps) {
        super(props);
        this.viewPoll = this.viewPoll.bind(this);
    }

    viewPoll(event) {
        event.preventDefault();
        browserHistory.push('/polls/' + this.props.poll.poll_id);
    }

    render() {
        // Return early if loading
        if (this.props.loading) {
            return (
                <div className="panel panel-default">
                    <div className="panel-body">
                        <Spinner />
                    </div>
                </div>
            );
        }

        let panelHeading: any = <a href="#" onClick={this.viewPoll}>{this.props.poll.question}</a>;

        let panelBody = this.props.poll.hasVoted ? <PollResult responses={this.props.poll.responses} /> : <PollResponses poll={this.props.poll} voteHandler={this.props.voteHandler} />

        let panelFooter = this.props.editable ?
            <PollToolBar id={this.props.poll.poll_id} editHandler={this.props.editHandler} deleteHandler={this.props.deleteHandler} /> : 
            <a href="#" onClick={(e) => {e.preventDefault(); browserHistory.push('/users/' + this.props.poll.username)}}>{this.props.poll.username}</a>;

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{panelHeading}</h3>
                </div>
                <div className="panel-body">
                    { panelBody }
                    <div className="text-right">
                        { panelFooter }
                    </div>
                </div>
            </div>
        );
    }
}