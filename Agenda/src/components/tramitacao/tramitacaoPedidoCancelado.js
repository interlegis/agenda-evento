import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUsuario } from '../../actions';
import { RoleAwareComponent } from 'react-router-role-authorization';
import { Link } from 'react-router';
import Cookies from 'js-cookie';

class TramitacaoPedidoCancelado extends RoleAwareComponent {
  constructor(props) {
    super(props);

    this.allowedRoles = ['admin','primeira_secretaria'];

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
      <div className="padding-top-5">
        <div className="row bs-wizard">
              <div className="col-xs-3 bs-wizard-step cancelado">
                <div className="text-center bs-wizard-stepnum">
                  Pedido Realizado
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot cancelado"></a>
                <div className="bs-wizard-info text-center">
                  O usuário realizou o pedido, faltando oficializar o pedido.
                </div>
              </div>

              <div className="col-xs-3 bs-wizard-step cancelado">
                <div className="text-center bs-wizard-stepnum">
                  Pedido Formalizado
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot cancelado"></a>
                <div className="bs-wizard-info text-center">
                  Pedido Oficializado Esperando Aprovação
                </div>
              </div>

              <div className="col-xs-3 bs-wizard-step cancelado">
                <div className="text-center bs-wizard-stepnum">
                  Aprovação do Pedido
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot cancelado"></a>
                <div className="bs-wizard-info text-center">
                  Passa o pedido do status de 'Pré-reservado' para 'Reservado'
                </div>
              </div>

              <div className="col-xs-3 bs-wizard-step cancelado">
                <div className="text-center bs-wizard-stepnum">
                  Publicação na Agenda
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot cancelado"></a>
                <div className="bs-wizard-info text-center">
                  Pedido Publicado na Agenda Semanal
                </div>
              </div>
          </div>
          <div className="center-div">
            <h3>Pedido cancelado.</h3>
          </div>
        </div>
    );
  }
}

export default connect(null,
  { getUsuario })(TramitacaoPedidoCancelado);
