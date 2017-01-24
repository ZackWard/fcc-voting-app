import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, hashHistory } from 'react-router';

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { reducer } from "./reducers";

import { VotingApp } from "./components/VotingApp";
import { RegisterUserFormContainer } from "./containers/RegisterUserFormContainer";
import { LoginFormContainer } from "./containers/LoginFormContainer";

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={VotingApp}>
        <Route path="/login" component={LoginFormContainer}></Route>
        <Route path="/register" component={RegisterUserFormContainer}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);