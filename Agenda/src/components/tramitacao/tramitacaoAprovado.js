import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUsuario } from '../../actions';
import { RoleAwareComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

class TramitacaoAprovado extends RoleAwareComponent {
  constructor(props) {
    super(props);

    this.allowedRoles = ['admin','primeira_secretaria'];

    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

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
              <div className="col-xs-3 bs-wizard-step complete">
                <div className="text-center bs-wizard-stepnum">
                  Pedido Realizado
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot"></a>
                <div className="bs-wizard-info text-center">
                  O usuário realizou o pedido, faltando oficializar o pedido.
                </div>
              </div>

              <div className="col-xs-3 bs-wizard-step complete">
                <div className="text-center bs-wizard-stepnum">
                  Pedido Formalizado
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot"></a>
                <div className="bs-wizard-info text-center">
                  Pedido Oficializado Esperando Aprovação
                </div>
              </div>
              <div className="col-xs-3 bs-wizard-step complete">
                <div className="text-center bs-wizard-stepnum">
                  Aprovação do Pedido
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot"></a>
                <div className="bs-wizard-info text-center">
                  Passa o pedido do status de 'Pré-reservado' para 'Reservado'
                </div>
              </div>
              <div className="col-xs-3 bs-wizard-step disabled">
                <div className="text-center bs-wizard-stepnum">
                  Publicação na Agenda
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot"></a>
                <div className="bs-wizard-info text-center">
                  Pedido Publicado na Agenda Semanal
                </div>
              </div>
          </div>
          <div className="center-div">
            <form>
              <div className="padding-top-5">
                <div className="space-15"></div>
                <label>Pedido deverá ser publicado na agenda na quarta-feira da semana anterior ao seu evento.</label>
                <input type="button" value="Cancelar Reserva" className="btn btn-danger" onClick={(event) => {this.props.onCancelar()}}/>
              </div>
            </form>
          </div>
      </div>
    );
  }
}

export default connect(null,
  { getUsuario })(TramitacaoAprovado);
