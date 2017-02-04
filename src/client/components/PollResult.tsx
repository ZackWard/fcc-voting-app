import * as React from "react";

interface PollResultProps {
    responses: any,
}

export const PollResult = (props: PollResultProps) => {
    let totalVotes = props.responses.reduce((acc, response) => acc + response.votes, 0);
    return (
        <ul>
            {
                props.responses.map((response, index) => {
                    let responsePercentage = Math.round((response.votes / totalVotes) * 100);
                    let progressBarStyle = {
                        width: responsePercentage + "%"
                    };
                    return (    
                        <div key={index} className="progress">
                            <div className="progress-bar" role="progressbar" aria-valuenow={responsePercentage} aria-valuemin="0" aria-valuemax="100" style={progressBarStyle}>
                                {response.response} - {responsePercentage}%
                            </div>
                        </div>
                    );
                })
            }
        </ul>
    );
};