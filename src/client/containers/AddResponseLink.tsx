import * as React from "react";
import { connect } from "react-redux";
import { castVote } from "../actions";

interface AddResponseLinkProps {
    poll: number,
    addCustomResponse: (poll: number, response: string) => any
}

interface AddResponseLinkState {
    customResponse: string,
    inputVisible: boolean
}

class AddResponseLinkComponent extends React.Component<AddResponseLinkProps, AddResponseLinkState> {

    constructor(props: AddResponseLinkProps) {
        super(props);

        // pre-bind methods
        this.addResponse = this.addResponse.bind(this);
        this.toggleInputVisible = this.toggleInputVisible.bind(this);
        this.updateInput = this.updateInput.bind(this);

        this.state = {
            customResponse: '',
            inputVisible: false
        };
    }

    addResponse(event) {
        event.preventDefault();
        this.props.addCustomResponse(this.props.poll, this.state.customResponse);
    }

    toggleInputVisible() {
        this.setState({
            customResponse: this.state.customResponse,
            inputVisible: ! this.state.inputVisible
        });
    }

    updateInput(event) {
        this.setState({
            customResponse: event.target.value,
            inputVisible: this.state.inputVisible
        });
    }

    render() {

        let otherLink = <a className="list-group-item" href="#" onClick={this.toggleInputVisible}>{this.props.children}</a>;

        let inputStyle = {
            "marginTop": "10px"
        };

        let responseInput = <div className="input-group" style={inputStyle}>
                                <input type="text" className="form-control" placeholder="Some other option..." onChange={this.updateInput} />
                                <div className="input-group-btn">
                                    <button className="btn btn-default" type="button" onClick={this.addResponse}>Vote</button>
                                    <button className="btn btn-default" type="button" onClick={this.toggleInputVisible}>Cancel</button>
                                </div>
                            </div>
                            

        return this.state.inputVisible ? responseInput : otherLink;
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        addCustomResponse: (poll, newResponse) => {dispatch(castVote(poll, -1, newResponse))}
    };
}

export const AddResponseLink = connect(mapStateToProps, mapDispatchToProps)(AddResponseLinkComponent);