import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUsuario } from '../../actions';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

class TramitacaoAprovado extends AuthorizedComponent {
  constructor(props) {
    super(props);

    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

    console.log(this.userRoles);

    this.notAuthorizedPath = '/not-found';

    this.state = {
      declaro: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e){
     e.preventDefault();
     console.log(this.state.declaro);
     if (this.state.declaro == 'on'){
       this.props.onUpdate();
     }else{
       alert("Marque a checkbox para formalizar o pedido")
     }
  }

  render() {
    console.log(this.props);
    return (
      <div>
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
            <form onSubmit={this.handleSubmit}>
              <div className="padding-top-5">
                <div className="space-15"></div>
                <label>Declaro que o pedido foi formalizado oficilamente.</label>
                <div className="space-15"></div>
                <input type="checkbox" name="aceito" onChange={
                  (event) =>
                  {
                    this.setState({declaro: event.target.value})
                  }} />
              </div>
              <div className="space-15"></div>
              <input type="submit" value="Formalizar" className="btn btn-primary"/>
            </form>
          </div>
      </div>
    );
  }
}

export default connect(null,
  { getUsuario })(TramitacaoAprovado);
