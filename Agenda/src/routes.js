import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './components/authentication/require_auth';
import App from './components/app';
import Home from './components/home';
import Cadastro from './components/cadastro';
import Main from './components/main';
import Login from './components/login';

export default(
  <Route path="/" component={App} location="history">
    <IndexRoute component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/cadastro" component={Cadastro} />
    <Route path="/main" component={requireAuth(Main)} />
  </Route>
);
