import * as React from "react";
import * as ReactDOM from "react-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { VotingApp } from "./components/VotingApp";

const initialState = {};

const tempReducer = (state = initialState, action) => {
  return state;
};

const store = createStore(tempReducer);

ReactDOM.render(
  <Provider store={store}>
    <VotingApp></VotingApp>
  </Provider>,
  document.getElementById('root')
);
