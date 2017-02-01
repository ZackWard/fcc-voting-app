import * as React from "react";
import { Poll } from "../components/Poll";

interface PollListProps {
    
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
    }

    render() {
        return (
            <div className="container">
                <h1>All Polls</h1>
            </div>
        );
    }
}