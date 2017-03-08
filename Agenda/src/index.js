import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import { AUTH_USUARIO } from './actions/types';

import App from './components/app';
import Home from './components/home';
import Cadastro from './components/cadastro';
import Main from './components/main';
import Login from './components/login';
import reducers from './reducers';
import requireAuth from './components/authentication/require_auth';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');

if (token) {
  store.dispatch({ type: AUTH_USUARIO })
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/cadastro" component={Cadastro} />
        <Route path="/main" component={requireAuth(Main)} />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('.container'));
