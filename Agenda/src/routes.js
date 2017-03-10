import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './components/authentication/require_auth';
import App from './components/app';
import Home from './components/home';
import Cadastro from './components/cadastro';
import Main from './components/main';
import Login from './components/login';
import NovoPedido from './components/pedido';
import MeusPedidos from './components/meusPedidos';
import EventoDetail from './components/eventoDetail';

export default(
  <Route path="/" component={App} location="history">
    <IndexRoute component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/cadastro" component={Cadastro} />
    <Route path="/main" component={requireAuth(Main)} />
    <Route path="/novoEvento" component={requireAuth(NovoPedido)} />
    <Route path="/pedidos" component={requireAuth(MeusPedidos)} />
    <Route path="/evento/:id" component={requireAuth(EventoDetail)} />
  </Route>
);
