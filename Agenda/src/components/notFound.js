import React, { Component } from 'react';
import Cookies from 'js-cookie';

export default class NotFound extends Component {
  renderAlert(){
    var userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

    if (userRoles.length == 0) {
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
        <div className="col-md-12 main-div">
          <h1>404 - Página Não Encontrada</h1>
        </div>
        <div className="col-md-12 main-div">
          {this.renderAlert()}
        </div>
      </div>
    );
  }
}
