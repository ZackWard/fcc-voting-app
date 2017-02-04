import * as React from "react";
import { PollContainer } from "../containers/PollContainer";

interface SinglePollViewProps {
    params: {
        pollId: number
    }
}

export const SinglePollView = (props: SinglePollViewProps) => {
    return (
        <div className="container">
            <PollContainer id={props.params.pollId} />
        </div>
    );
};