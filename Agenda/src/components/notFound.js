import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUsuario } from '../actions';
import Cookies from 'js-cookie';

class NotFound extends Component {
  componentWillMount() {
    this.props.getUsuario();
  }

  renderAlert(){
    var userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

    if (userRoles.length == 0 && this.props.notUrl == false ) {
      return(
        <div className="alert alert-danger">
          <strong>Oops!</strong> Usuario não é admin ou da primeira secretaria
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="col-md-12 main-div padding-5">
          <h1>404 - Página Não Encontrada</h1>
        </div>
        <div className="col-md-12 main-div">
          {this.renderAlert()}
        </div>
      </div>
    );
  }
}

export default connect(null,
  { getUsuario })(NotFound);
