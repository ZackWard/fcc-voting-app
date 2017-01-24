import * as React from "react";
import { NavContainer } from "../containers/NavContainer";

export const VotingApp = (props) => {
    return (
        <div>
            <NavContainer></NavContainer>
            <h1>Free Code Camp Voting App</h1>
            <h2>by Zack Ward</h2>
            {props.children}
        </div>
    );
};