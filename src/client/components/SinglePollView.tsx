import * as React from "react";
import { Poll } from "../containers/Poll";

interface SinglePollViewProps {
    params: {
        pollId: number
    }
}

export const SinglePollView = (props: SinglePollViewProps) => {

    return (
        <div className="container">
            <Poll id={Number(props.params.pollId)} />
        </div>
    );
};