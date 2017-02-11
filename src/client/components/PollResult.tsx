import * as React from "react";
import * as d3 from "d3";

import { PieSlice } from "./PieSlice";

interface PollResultProps {
    responses: any
}

interface PollResultState {
    highlighted: string | null,
    percentage: number | null
}

export class PollResult extends React.Component<PollResultProps, PollResultState> {
    
    constructor(props: PollResultProps) {
        super(props);

        // Prebind methods
        this.highlightResult = this.highlightResult.bind(this);
        this.unHighlightResult = this.unHighlightResult.bind(this);

        this.state = {
            highlighted: null,
            percentage: null
        };
    }

    highlightResult(response: string) {
        let newState = {
            highlighted: this.state.highlighted,
            percentage: this.state.percentage
        };
        
        let votes: number = 0, totalVotes: number = 0;
        for (let i: number = 0; i < this.props.responses.length; i++) {
            totalVotes += this.props.responses[i].votes;
            votes += (this.props.responses[i].response == response) ? this.props.responses[i].votes : 0;
        }

        newState.highlighted = response;
        newState.percentage = Math.round((votes / totalVotes) * 100);

        this.setState(newState);
    }

    unHighlightResult() {
        this.setState({
            highlighted: null
        });
    }

    render() {
        
        // D3.js set up
        let innerRadius = 30;
        let outerRadius = 48;

        let arcs = d3.pie().value(d => d.votes)(this.props.responses);
        let arcGen = d3.arc().padAngle(0.04).outerRadius(outerRadius).innerRadius(innerRadius);
        let color = d3.scaleOrdinal(d3.schemeCategory20); // Implicit ordinal scale

        // Chart style and spacing

        let chartHeight = 200;
        let chartWidth = 200;

        let legendSize = 12;

        let svgStyle = {
            width: "75%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"
        };

        let tableStyle = {
            marginTop: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: "1.2em"
        };

        let htmlLegendStyle = {
            marginLeft: "auto",
            marginRight: "auto"
        };

        let captionFontSize = "10px";
        let captionOptions: any = {};

        if (this.state.highlighted !== null && this.state.highlighted.length > 10) {
            captionFontSize = "8px";
            captionOptions.textLength = (innerRadius * 2) - 10;
            captionOptions.lengthAdjust = "spacingAndGlyphs";
        }

        return (
            <div className="poll-results">
                <div className="row">
                    <div className="col-xs-12 col-md-6">
                        <svg style={svgStyle} viewBox="0 0 100 100">
                            <g transform="translate(50, 50)">
                                {arcs.map((arc, index) => {
                                    return (<PieSlice 
                                        highlighted={this.state.highlighted == arc.data.response} 
                                        highlight={this.highlightResult} 
                                        unhighlight={this.unHighlightResult} 
                                        key={index} 
                                        response={arc.data.response} 
                                        arc={arcGen(arc)} 
                                        color={color(arc.data.response)} 
                                    />);
                                })}
                            </g>
                            {
                                this.state.highlighted !== null &&
                                <g transform="translate(50, 53)">
                                    <text transform="translate(0, -7)" textAnchor="middle">{this.state.percentage}%</text>
                                    <text transform="translate(0, 7)" fontSize={captionFontSize} textAnchor="middle" {...captionOptions}>{this.state.highlighted}</text>
                                </g>
                            }
                        </svg>
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <div style={htmlLegendStyle}>
                            <table style={tableStyle}>
                                <tbody>
                                    {arcs.map((arc, index) => {
                                        let cellStyle = {
                                            background: color(arc.data.response),
                                            width: legendSize + "px",
                                            height: legendSize + "px",
                                            margin: "10px"
                                        };
                                        return <tr key={index}><td><div style={cellStyle}></div></td><td>{arc.data.response}</td></tr>;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}