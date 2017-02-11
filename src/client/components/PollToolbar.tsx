import * as React from "react";

interface PollToolbarProps {
    poll: any,
    editHandler: (poll: number) => any,
    deleteHandler: (poll: number) => any
}

export const PollToolBar = (props: PollToolbarProps) => {
    let linkStyles = {
        marginLeft: "5px"
    };

    let tweetLink = "https://twitter.com/intent/tweet?";
    tweetLink += "text=" + "Vote now! " + props.poll.question;
    tweetLink += "&url=" + "https://" + window.location.host + "/polls/" + props.poll.poll_id;
    tweetLink += "&hashtags=freeCodeCamp";
    tweetLink = encodeURI(tweetLink);

    return (
        <div className="poll-toolbar">
            <a href={tweetLink}><i className="fa fa-twitter" aria-hidden="true"></i></a>
            <a href="#" aria-label="Delete Poll" style={linkStyles} onClick={(e) => { e.preventDefault(); props.deleteHandler(props.poll.poll_id) }} >
                <i className="fa fa-trash-o" aria-hidden="true"></i></a>
        </div>
    );
};