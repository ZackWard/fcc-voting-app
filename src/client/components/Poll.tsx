import * as React from "react";
import { browserHistory } from "react-router";
import { VoteLink } from "./VoteLink";

interface PollProps {
    poll: any,
    loading: boolean,
    voteHandler: (poll: number, response: number) => any
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
        if (this.props.loading) {
            return (
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h2 className="panel-title">Loading...</h2>
                    </div>
                </div>
            );
        }

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title"><a href="#" onClick={this.viewPoll}>{this.props.poll.question}</a></h3>
                </div>
                <div className="panel-body">
                    <ul>
                        {
                            this.props.poll.responses.map((response, index) => {
                                return (
                                    <li key={index}>
                                        <VoteLink pollId={this.props.poll.poll_id} responseId={index} clickHandler={this.props.voteHandler}>
                                            {response.response} - Votes: {response.votes}
                                        </VoteLink>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    {this.props.poll.hasVoted ? <b>You've already voted!</b> : false}
                </div>
            </div>
        );
    }
}