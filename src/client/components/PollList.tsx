import * as React from "react";
import { Poll } from "../containers/Poll";

interface PollListProps {
    polls: any[]
}

interface PollListState {

}

export class PollList extends React.Component<PollListProps, PollListState> { 
    
    constructor(props: PollListProps) {
        super(props);
    }

    render() {
        let columns = 2;
        let rows = Math.ceil(this.props.polls.length / columns);

        let polls = this.props.polls.map((poll) => <div key={poll.poll_id} className="col-xs-12 col-md-6"><Poll id={poll.poll_id} /></div>);

        let pollElements = [];

        for (let r: number = 0; r < rows; r++) {
            let row = [];
            for (let c: number = 0; c < columns; c++) {
                if (polls.length > 0) {
                    row.push(polls.shift());
                }
            }
            pollElements.push(<div key={"row" + r + 1} className="row">{row}</div>);
        }

        return (
            <div className="container">
                {pollElements}
            </div>
        );
    }
};