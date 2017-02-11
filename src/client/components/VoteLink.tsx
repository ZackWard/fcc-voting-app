import * as React from "react";

interface VoteLinkProps {
    pollId: number,
    responseId: number,
    children?: any,
    clickHandler: (poll: number, response: number) => any
}

export const VoteLink = (props: VoteLinkProps) => {

    const thisClickHandler = (event) => {
        event.preventDefault();
        props.clickHandler(props.pollId, props.responseId);
    };

    return (
        <a href="#" className="list-group-item" onClick={thisClickHandler}>{props.children}</a>
    );
};