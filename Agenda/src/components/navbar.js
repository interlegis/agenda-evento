import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signoutUser } from '../actions';
import { Link } from 'react-router';

class Navbar extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  logout(){
    this.props.signoutUser();
    this.context.router.push('/');
  }

  renderLinks(){
    if (!this.props.authenticated) {
      return (
        <ul className="nav navbar-nav">
          <li><Link to="">Agenda</Link></li>
          <li className="navbar-right"><Link to="/cadastro">Cadastro</Link></li>
          <li className="navbar-right"><Link to="/login">Login</Link></li>
        </ul>
      );
    }
    return (
      <ul className="nav navbar-nav">
        <li><Link to="">Agenda</Link></li>
        <li><Link to="/pedidos">Meus Pedidos</Link></li>
        <li><Link to="/novoEvento">Novo Evento</Link></li>
        <li className ="dropdown navbar-right">
            <Link to="" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Perfil<span className="caret"></span></Link>
            <ul className="dropdown-menu">
              <li><Link to="/configuracoes">Configurações</Link></li>
              <li role="separator" className="divider"></li>
              <li><a onClick={this.logout.bind(this)}>Sair</a></li>
            </ul>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <Link className="navbar-brand" to="">
            <img alt="Brand" src="/style/img/logo_interlegis.png"/>
          </Link>
              {this.renderLinks()}
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state){
  return {
    authenticated: state.authentication.authenticated,
    user: state.user.usuario
  };
}

export default connect(mapStateToProps, { signoutUser })(Navbar);
