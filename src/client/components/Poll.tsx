import * as React from "react";

interface PollResponse {
    response: string,
    votes: number
}

interface PollProps {
    id: number,
    question: String,
    responses: PollResponse[]
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
                                    <li key={index}>{response.response} ({response.votes})</li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}