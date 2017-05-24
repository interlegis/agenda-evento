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
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav navbar-right">
            <li><Link to="/">Início</Link></li>
            <li><Link to="inicio/agenda">Agenda</Link></li>
            <li className="navbar-right"><Link to="/cadastro">Cadastro</Link></li>
            <li className="navbar-right"><Link to="/login">Login</Link></li>
          </ul>
        </div>
      );
    }
    var perfil;
    if (!this.props.user){
      perfil = "Perfil"
    }else{
      perfil = this.props.user.first_name;
    }
    return (
      <div className="collapse navbar-collapse">
        <ul className="nav navbar-nav navbar-right">
          <li><Link to="/main">Inicio</Link></li>
          <li><Link to="/agenda">Agenda</Link></li>
          <li><Link to="/pedidos">Pedidos</Link></li>
          <li><Link to="/novoEvento">Novo Evento</Link></li>
          <li className ="dropdown navbar-right">
              <Link to="" className="dropdown-toggle" data-toggle="dropdown"
                role="button" aria-haspopup="true" aria-expanded="false">
                Bem-Vindo, {perfil}<span className="caret"></span>
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/configuracoes">Configurações</Link></li>
                <li role="separator" className="divider"></li>
                <li><a onClick={this.logout.bind(this)}>Sair</a></li>
              </ul>
          </li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle"
              data-toggle="collapse" data-target=".navbar-collapse"
              aria-controls="navbarNav" aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">
              <img className="hidden-xs" alt="Brand" src="/style/img/Inter_Logo.jpg"/>
              <span className="title visible-xs">Interlegis</span>
            </Link>
          </div>
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
