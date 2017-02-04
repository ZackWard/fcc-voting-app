import * as React from "react";

interface PollToolbarProps {
    id: number,
    editHandler: (poll: number) => any,
    deleteHandler: (poll: number) => any
}

export const PollToolBar = (props: PollToolbarProps) => {
    return (
        <div className="poll-toolbar">
            <div className="btn-group" role="group" aria-label="buttons">
                <a className="btn btn-default" href="#" aria-label="Edit Poll" onClick={(e) => { e.preventDefault(); props.editHandler(props.id); }}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </a>
                <a className="btn btn-default" href="#" aria-label="Delete Poll" onClick={(e) => { e.preventDefault(); props.deleteHandler(props.id) }} >
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    );
};