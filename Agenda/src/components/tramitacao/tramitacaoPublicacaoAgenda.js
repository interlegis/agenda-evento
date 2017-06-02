import React from 'react';
import { connect } from 'react-redux';
import { getUsuario } from '../../actions';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

class tramitacaoPublicacaoAgenda extends AuthorizedComponent {
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
      <div className="row bs-wizard">
            <div className="col-xs-3 bs-wizard-step complete">
              <div className="text-center bs-wizard-stepnum">Pedido Realizado</div>
              <div className="progress"><div className="progress-bar"></div></div>
              <a href="#" className="bs-wizard-dot"></a>
              <div className="bs-wizard-info text-center">O usuário realizou o pedido, faltando oficializar o pedido.</div>
            </div>

            <div className="col-xs-3 bs-wizard-step complete">
              <div className="text-center bs-wizard-stepnum">Pedido Formalizado</div>
              <div className="progress"><div className="progress-bar"></div></div>
              <a href="#" className="bs-wizard-dot"></a>
              <div className="bs-wizard-info text-center">Pedido Oficializado Esperando Aprovação</div>
            </div>

            <div className="col-xs-3 bs-wizard-step complete">
              <div className="text-center bs-wizard-stepnum">Aprovação do Pedido</div>
              <div className="progress"><div className="progress-bar"></div></div>
              <a href="#" className="bs-wizard-dot"></a>
              <div className="bs-wizard-info text-center">Passa o pedido do status de 'Pré-reservado' para 'Reservado'</div>
            </div>

            <div className="col-xs-3 bs-wizard-step complete">
              <div className="text-center bs-wizard-stepnum">Publicação na Agenda</div>
              <div className="progress"><div className="progress-bar"></div></div>
              <a href="#" className="bs-wizard-dot"></a>
              <div className="bs-wizard-info text-center">Pedido Publicado na Agenda Semanal</div>
            </div>
        </div>
    );
  }
}

export default connect(null,
  { getUsuario })(tramitacaoPublicacaoAgenda);
