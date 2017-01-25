import { connect } from "react-redux";
import { PollForm } from "../components/PollForm";

import * as actions from "../actions";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: (poll) => {dispatch(actions.submitPollForm(poll))}
    };
};

export const PollFormContainer = connect(mapStateToProps, mapDispatchToProps)(PollForm);