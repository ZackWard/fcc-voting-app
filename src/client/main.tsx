import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, browserHistory } from 'react-router';

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { reducer } from "./reducers";

import { VotingApp } from "./containers/VotingApp";
import { PollList } from "./containers/PollList";
import { SinglePollView } from "./containers/SinglePollView";
import { RegisterUserForm } from "./containers/RegisterUserForm";
import { LoginForm } from "./containers/LoginForm";
import { PollForm } from "./containers/PollForm";

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={VotingApp}>
        <Route path="/login" component={LoginForm}></Route>
        <Route path="/register" component={RegisterUserForm}></Route>
        <Route path="/polls/new" component={PollForm}></Route>
        <Route path="/polls/:pollId/edit" component={PollForm}></Route>
        <Route path="/polls/:pollId" component={SinglePollView}></Route>
        <Route path="/polls" component={PollList}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);