import * as React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

interface PollFormProps {
    submitForm: (poll: any) => any,
    user: null | string,
    error: null | string
}

interface PollFormState {
    pollQuestion: string,
    responses: string[]
}

export class PollFormComponent extends React.Component<PollFormProps, PollFormState> {

    constructor(props: PollFormProps) {
        super(props);

        // Pre-bind methods
        this.handleAddResponseField = this.handleAddResponseField.bind(this);
        this.handleDeleteResponseField = this.handleDeleteResponseField.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);

        // Set initial state
        this.state = {
            pollQuestion: '',
            // Set the responses array to 3 empty strings to prevent React from complaining that we're switching from uncontrolled to controlled inputs
            responses: [
                '',
                '',
                ''
            ]
        };
    }

    handleAddResponseField() {
        let newResponses = this.state.responses;
        newResponses.push('');
        this.setState({
            responses: newResponses,
            pollQuestion: this.state.pollQuestion
        });
    }

    handleDeleteResponseField(index: number) {
        let newResponses = this.state.responses.filter((response, i) => i !== index);
        this.setState({
            responses: newResponses,
            pollQuestion: this.state.pollQuestion
        });
    }

    handleChange(event) {
        let newPollQuestion: string = (event.target.name == "pollQuestion") ? event.target.value : this.state.pollQuestion;
        let newResponses = [];
        for (let i: number = 0; i < this.state.responses.length; i++) {
            newResponses[i] = (event.target.name == "responseField" + i) ? event.target.value : this.state.responses[i];
        }
        this.setState({
            pollQuestion: newPollQuestion,
            responses: newResponses
        });
    }

    handleSubmitForm(event) {
        event.preventDefault();
        let poll: any = {
            question: this.state.pollQuestion,
            responses: this.state.responses
        };
        poll.responses = poll.responses.filter(responseString => responseString.length >= 1);
        poll.responses = poll.responses.map(responseString => {
            return {
                response: responseString,
                votes: []
            };
        });
        this.props.submitForm(poll);
    }

    render() {
        if (this.props.user == null) {
            return (
                <div>
                    <h1>Please login to add or edit forms</h1>
                </div>
            );
        }

        let responseFields: any = [];
        for (let i: number = 0; i < this.state.responses.length; i++) {
            let elementName = "responseField" + i;
            responseFields.push(
                <div className="form-group" key={elementName}>
                    <label htmlFor={elementName}>Response</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id={elementName} name={elementName} value={this.state.responses[i]} onChange={this.handleChange} placeholder="Response" />
                        <span className="input-group-btn">
                            <button className="btn btn-default" onClick={() => {this.handleDeleteResponseField(i)}} type="button"><i className="fa fa-trash-o"></i></button>
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <div className="container PollForm">
                <form>
                    { this.props.error && 
                        <div className="alert alert-danger" role="alert">{this.props.error}</div>
                    }
                    <div className="form-group">
                        <label htmlFor="pollQuestion">Question:</label>
                        <input type="text" className="form-control" id="pollQuestion" name="pollQuestion" value={this.state.pollQuestion} onChange={this.handleChange} placeholder="Question" />
                    </div>
                    { responseFields }
                    <div className="text-center">
                        <div className="btn-group btn-group-lg" role="group">
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmitForm}>Submit/Save</button>
                            <button type="button" className="btn btn-default" onClick={this.handleAddResponseField}>Add response field</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        error: state.pollForm.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: (poll) => {dispatch(actions.submitPollForm(poll))}
    };
};

export const PollForm = connect(mapStateToProps, mapDispatchToProps)(PollFormComponent);