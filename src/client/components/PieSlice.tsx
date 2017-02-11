import * as React from "react";

interface PieSliceProps {
    highlighted: boolean,
    response: string,
    arc: string,
    color: string,
    highlight: (response: string) => any,
    unhighlight: () => any
}

export const PieSlice = (props: PieSliceProps) => {

    let highlightColor = "black";

    let pathStyle = {
        cursor: "pointer"
    };

    let params: any = {
        d: props.arc,
        fill: props.color,
        stroke: props.highlighted ? highlightColor : props.color,
        strokeWidth: 0.5,
        style: pathStyle,
        onMouseOver: (e) => {props.highlight(props.response)},
        onClick: (e) => {props.highlight(props.response)},
        onMouseOut: (e) => {props.unhighlight()}
    };

    if (props.highlighted) {
        params.fillOpacity = "0.85";
    }

    return (
        <g>
            <path {...params} />
        </g>
    );
};