import * as React from "react";
import { Poll } from "../components/Poll";

interface PollListProps {
    params: {
        pollId: number
    }
}

interface PollResponse {
    response: string,
    votes: number
}

interface PollListState {
    id: number,
    question: string,
    responses: PollResponse[]
}

export class PollList extends React.Component<PollListProps, PollListState> {

    constructor(props: PollListProps) {
        super(props);

        this.state = {
            id: null,
            question: "Question",
            responses: []
        };

        let myInit = { method: "GET" };
        let myRequest = new Request('/api/polls/' + this.props.params.pollId, myInit);
        fetch(myRequest)
        .then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.setState({
                        id: json.poll_id,
                        question: json.question,
                        responses: json.responses.map(response => {
                            return {
                                response: response.response,
                                votes: response.votes.length
                            };
                        })
                    });
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="container">
                <Poll id={this.state.id} question={this.state.question} responses={this.state.responses}></Poll>
            </div>
        );
    }
}