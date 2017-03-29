import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signoutUser, getUsuario } from '../actions';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

class Main extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    this.props.getUsuario();
  }

  logout(){
    this.props.signoutUser();
    this.context.router.push('/');
  }

  render() {
    const { user } = this.props;
    console.log(user);
    if (user) {
      return (
        <div>
          <h1 className="bottom-space">Bem Vindo(a), {user.first_name}.</h1>
            <div className="col-md-12 row cards-section">
              <Link to="/pedidos"><div className="col-md-4 col-xs-12 card">
                <p className="card-text">Meus Pedidos/Eventos</p>
              </div></Link>
              <Link to="/novoEvento"><div className="col-md-4 col-xs-12 card">
                  <p className="card-text">Novo Pedido</p>
              </div></Link>
              <Link to="/agenda"><div className="col-md-4 col-xs-12 card">
                <p className="card-text">Agenda</p>
              </div></Link>
            </div>
        </div>
      );
    }
    return (
      <div>
        <h2>Carregando...</h2>
      </div>
    );
  }

}

function mapStateToProps(state){
  return { user: state.user.usuario };
}

export default connect(mapStateToProps, { signoutUser, getUsuario })(Main);
