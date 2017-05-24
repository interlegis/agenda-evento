import React from 'react';
import { connect } from 'react-redux';
import { getUsuario } from '../actions';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

class Admin_Area extends AuthorizedComponent {
  constructor(props) {
    super(props);
    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));
    console.log(this.userRoles);
    this.notAuthorizedPath = '/not-found';
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    this.props.getUsuario();
    if ((Cookies.get('roles') === undefined) ||
    (Cookies.get('roles') === null)) {
      this.context.router.push(`${this.notAuthorizedPath}`);
    }
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

export default connect(null,
  { getUsuario })(Admin_Area);
