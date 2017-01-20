"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var VotingApp_1 = require("./components/VotingApp");
var initialState = {};
var tempReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    return state;
};
var store = redux_1.createStore(tempReducer);
ReactDOM.render(<react_redux_1.Provider store={store}>
    <VotingApp_1.VotingApp></VotingApp_1.VotingApp>
  </react_redux_1.Provider>, document.getElementById('root'));
