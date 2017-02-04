import * as React from "react";

interface SpinnerProps {

}

export const Spinner = (props: SpinnerProps) => {
    return (
        <div className="spinner text-center">
            <i className="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i>
            <span className="sr-only">Loading...</span>
        </div>
    );
};