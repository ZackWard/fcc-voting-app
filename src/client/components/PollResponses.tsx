import * as React from "react";
import { VoteLink } from "./VoteLink";

interface PollResponsesProps {
    poll: any,
    voteHandler: (poll: number, response: number) => any
}

export const PollResponses = (props: PollResponsesProps) => {

    let responseElements: any = props.poll.responses.map((response, index) => {
        return (
            <li key={index}>
                <VoteLink pollId={props.poll.poll_id} responseId={index} clickHandler={props.voteHandler}>
                    {response.response} - Votes: {response.votes}
                </VoteLink>
            </li>
        );
    });

    return (
        <ul>
            { responseElements }
        </ul>
    );
};