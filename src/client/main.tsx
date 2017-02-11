import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, browserHistory } from 'react-router';

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { reducer } from "./reducers";

import { VotingApp } from "./containers/VotingApp";
import { PollListView } from "./containers/PollListView";
import { PollListByUser } from "./containers/PollListByUser";
import { SinglePollView } from "./components/SinglePollView";
import { RegisterUserForm } from "./containers/RegisterUserForm";
import { LoginForm } from "./containers/LoginForm";
import { PollForm } from "./containers/PollForm";

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// This is so awful, but hopefully it will work for now
let baseUrl = window.location.host == "zackward.net" ? "/projects/voting-app/" : "/"

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={baseUrl} component={VotingApp}>
        <Route path="/login" component={LoginForm} />
        <Route path="/register" component={RegisterUserForm} />
        <Route path="/polls/new" component={PollForm} />
        <Route path="/polls/:pollId" component={SinglePollView} />
        <Route path="/polls" component={PollListView} />
        <Route path="/users/:user/polls" component={PollListByUser} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);