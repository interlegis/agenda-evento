import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './components/authentication/require_auth';
import App from './components/app';
import Home from './components/home';
import Cadastro from './components/cadastro';
import Main from './components/main';
import AgendaHome from './components/agenda_home';
import Agenda from './components/agenda';
import Login from './components/login';
import NovoPedido from './components/pedido';
import MeusPedidos from './components/meusPedidos';
import EventoDetail from './components/eventoDetail';
import Configuracoes from './components/configuracoes';
import EditarPedido from './components/editarPedido';
import Admin_Area from './components/admin_area';
import NotFound from './components/notFound';
import Faq from './components/faq';
import EsqueciSenha from './components/esqueciSenha';
import TodosPedidos from './components/todosPedidos';
import RecuperarSenha from './components/recuperarSenha'

export default(
  <Route path="/" component={App} location="history">
    <IndexRoute component={Home} />
    <Route path="/agenda" component={Agenda} />
    <Route path="/inicio/agenda" component={AgendaHome} />
    <Route path="/login" component={Login} />
    <Route path="/cadastro" component={Cadastro} />
    <Route path="/main" component={requireAuth(Main)} />
    <Route path="/novoEvento" component={requireAuth(NovoPedido)} />
    <Route path="/pedidos" component={requireAuth(MeusPedidos)} authorize={['primeira_secretaria','admin']} />
    <Route path="/evento/:id" component={requireAuth(EventoDetail)} />
    <Route path="/faq" component={Faq} />
    <Route path="/evento/editar/:id" component={requireAuth(EditarPedido)} />
    <Route path="/configuracoes" component={requireAuth(Configuracoes)} />
    <Route path="/admin/:id" component={requireAuth(Admin_Area)} authorize={['primeira_secretaria','admin']} />
    <Route path="/todosPedidos" component={TodosPedidos} authorize={['primeira_secretaria','admin']} />
    <Route path="/esquecisenha" component={EsqueciSenha} />
    <Route path="/recuperarsenha/:token" component={RecuperarSenha} />
    <Route path="/not-found" component={NotFound} notUrl={false}/>
    <Route path='*' component={NotFound} notUrl={true}/>
  </Route>
);
