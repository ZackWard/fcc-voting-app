import * as React from "react";

import { VoteLink } from "./VoteLink";

interface PollResponse {
    response: string,
    votes: number
}

interface PollProps {
    id: number,
    question: String,
    responses: PollResponse[],
    voteHandler: (poll: number, response: number) => any
}

interface PollState {
    
}

export class Poll extends React.Component<PollProps, PollState> {

    constructor(props: PollProps) {
        super(props);
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{this.props.question}</h3>
                </div>
                <div className="panel-body">
                    <ul>
                        {
                            this.props.responses.map((response, index) => {
                                return (
                                    <li key={index}>
                                        <VoteLink pollId={this.props.id} responseId={index} clickHandler={this.props.voteHandler}>
                                            {response.response} - Votes: {response.votes}
                                        </VoteLink>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}