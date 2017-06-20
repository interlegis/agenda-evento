import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUsuario, checkDatasEvento } from '../../actions';
import { RoleAwareComponent } from 'react-router-role-authorization';
import TabelaPedidosConcorrentes from './tabelaPedidosConcorrentes'
import Cookies from 'js-cookie';

class TramitacaoFormalizacao extends RoleAwareComponent {
  constructor(props) {
    super(props);

    this.allowedRoles = ['admin','primeira_secretaria'];

    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

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
    this.props.checkDatasEvento(this.props.evento.data_inicio,this.props.evento.data_fim);
  }

  handleSubmit(e){
     e.preventDefault();
     console.log(this.state.declaro);
     if (this.state.declaro == 'on'){
       this.props.onReservar();
     }else{
       alert("Marque a checkbox para formalizar o pedido")
     }
  }

  render() {
    return (
      <div className="padding-top-5">
        <div className="row bs-wizard">
              <div className="col-xs-3 bs-wizard-step complete">
                <div className="text-center bs-wizard-stepnum">Pedido Realizado</div>
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
            <div>
              <h3>Esse evento está com status de pré-reservado. Verifique os eventos pré-reservados nessas datas abaixo:</h3>
              <TabelaPedidosConcorrentes pedidos={this.props.eventosConcorrentes} id_={this.props.id_}/>
            </div>
          <br/>
            <form onSubmit={this.handleSubmit} className="center">
              <div className="padding-top-5 margin-20">
                <div className="space-15"></div>
                <label>Desejo aprovar a reserva desse evento para publicação na Agenda.</label>
                <div className="space-15"></div>
                <input type="checkbox" name="aceito" onChange={
                  (event) =>
                  {
                    this.setState({declaro: event.target.value})
                  }} />
              </div>
              <div className="space-15"></div>
              <input type="submit" value="Formalizar" className="btn btn-primary"/>
              <input type="button" value="Cancelar Reserva" className="btn btn-danger" onClick={() => {this.props.onCancelar()}}/>
            </form>
          </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state.pedidos.eventosConcorrentes);
  return {
    eventosConcorrentes: state.pedidos.eventosConcorrentes
  };
}
export default connect(mapStateToProps,
  { getUsuario, checkDatasEvento })(TramitacaoFormalizacao);
