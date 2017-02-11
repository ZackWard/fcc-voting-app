import * as React from "react";
import { VoteLink } from "./VoteLink";
import { AddResponseLink } from "../containers/AddResponseLink";

interface PollResponsesProps {
    poll: any,
    user: string | boolean,
    voteHandler: (poll: number, response: number) => any
}

export const PollResponses = (props: PollResponsesProps) => {

    let responseElements: any = props.poll.responses.map((response, index) => {
        return (
                <VoteLink key={index} pollId={props.poll.poll_id} responseId={index} clickHandler={props.voteHandler}>
                    {response.response} - Votes: {response.votes}
                </VoteLink>
        );
    });

    return (
        <div className="poll-responses list-group">
            { responseElements }
            { props.user && <AddResponseLink poll={props.poll.poll_id}>Other...</AddResponseLink> }
        </div>
    );
};