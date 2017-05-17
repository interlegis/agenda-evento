import React from 'react';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

export default class Admin_Area extends AuthorizedComponent {
  constructor(props) {
    super(props);

    this.userRoles = JSON.parse(Cookies.get('roles'));
    this.notAuthorizedPath = '/not-found';
  }


  render() {
    return (
      <div>
        <div className="col-md-12 main-div">
          <h1>Area do Administrador</h1>
        </div>
      </div>
    );
  }
}
