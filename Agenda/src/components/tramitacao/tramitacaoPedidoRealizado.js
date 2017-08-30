import React, { PropTypes } from 'react';
import { connect} from 'react-redux';
import { getUsuario } from '../../actions';
import { RoleAwareComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

class TramitacaoPedidoRealizado extends RoleAwareComponent {
  constructor(props) {
    super(props);

    this.allowedRoles = ['admin','primeira_secretaria'];

    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

    console.log(this.userRoles);

    this.notAuthorizedPath = '/not-found';

    this.state = {
      declaro: '',
      file: ''
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
     console.log(this.props);
     if (this.state.declaro == 'on'){
       const file = this.state.file;
       const data = new FormData();
       data.append('nome',file.name);
       data.append('pdf', file);
       this.props.onPedidoRecebido(data);
     }else{
       swal({
          title: "Confirme sua tramitação",
          text: "marque a checkbox para formalizar o pedido",
          type: "warning",
          showCancelButton: false,
          showConfirmButton: true,
          closeOnConfirm: true,
          animation: "slide-from-top",
          timer: 2000,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        });
     }
  }

  render() {
    const jsx = (
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

              <div className="col-xs-3 bs-wizard-step disabled">
                <div className="text-center bs-wizard-stepnum">
                  Pedido Formalizado
                </div>
                <div className="progress"><div className="progress-bar"></div></div>
                <a href="#" className="bs-wizard-dot"></a>
                <div className="bs-wizard-info text-center">
                  Pedido Oficializado Esperando Aprovação
                </div>
              </div>

              <div className="col-xs-3 bs-wizard-step disabled">
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
            <h3 align="center">
              Para confirmar a formalização desse pedido insira o documento (ofício) de confirmação abaixo:
            </h3>
            <form onSubmit={this.handleSubmit}>
              <div>
                <input type="file" name="oficio" accept=".pdf" onChange={ (event) => this.setState({file: event.target.files[0]}) }/>
              </div>
              <div className="padding-top-5">
                <input type="checkbox" name="aceito" onChange={
                  (event) =>
                  {
                    this.setState({declaro: event.target.value})
                  }} />
                <div className="space-15"></div>
                <label>Declaro que o pedido foi formalizado oficilamente.</label>
                <div className="space-15"></div>
              </div>
              <input type="submit" value="Formalizar" className="btn btn-primary"/>
              <input type="button" value="Cancelar Reserva" className="btn btn-danger" onClick={(event) => {this.props.onCancelar()}}/>
            </form>
          </div>
        </div>
    );
  return this.rolesMatched() ? jsx : null;
  }
}

export default connect(null,
  { getUsuario })(TramitacaoPedidoRealizado);
