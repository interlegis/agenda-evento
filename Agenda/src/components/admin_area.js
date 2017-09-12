import React from 'react';
import { connect } from 'react-redux';
import { getUsuario, getPedidoEvento,formalizarPedido,
        reservarPedido, cancelarPedido }
from '../actions';
import { ROOT_URL } from '../actions/types';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

import TramitacaoFormalizacao from './tramitacao/tramitacaoFormalizacao';
import TramitacaoPublicacaoAgenda from './tramitacao/tramitacaoPublicacaoAgenda';
import TramitacaoAprovado from './tramitacao/tramitacaoAprovado';
import TramitacaoPedidoRealizado from './tramitacao/tramitacaoPedidoRealizado';
import TramitacaoPedidoCancelado from './tramitacao/tramitacaoPedidoCancelado';
import axios from 'axios';

var ID;

class Admin_Area extends AuthorizedComponent {
  constructor(props) {
    super(props);

    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

    this.notAuthorizedPath = '/not-found';
    this.pedidoRecebido = this.pedidoRecebido.bind(this);
    this.pedidoReservar = this.pedidoReservar.bind(this);
    this.cancelarPedidoTramitacao = this.cancelarPedidoTramitacao.bind(this);
    ID = this.props.params.id;
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    this.props.getUsuario();
    this.props.getPedidoEvento(this.props.params.id);
  }

  renderAlert(){
    if (this.props.errorMessage) {
      return(
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  pedidoRecebido(data){
    var payload = {'id': this.props.params.id,
                   data};
    this.props.formalizarPedido(payload);
    this.props.getPedidoEvento(this.props.params.id);
  }

  pedidoReservar(){
    this.props.reservarPedido(this.props.params.id);
  }

  cancelarPedidoTramitacao(){
    const id = this.props.params.id;
    swal({
      title: "Cancelar Pedido",
      text: "Insira o motivo do cancelamento:",
      type: 'input',
      showCancelButton: true,
      showConfirmButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: 'Escreva o motivo do cancelamento',
      confirmButtonText: "Continuar",
      cancelButtonText: "Sair",
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    },
    function(causa_cancelamento){
      if (causa_cancelamento === false) return false;

      if (causa_cancelamento === "") {
        swal.showInputError("Escreva a causa do cancelamento!");
        return false
      }

      const config_user = {
        headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Content-Type': 'application/json',
            'Authorization': 'token ' + localStorage.token
        }
      };

      const data = {
        "reservado": 'C',
        "causa_cancelamento": causa_cancelamento
      };

      axios.post(`${ROOT_URL}api/pedido/${ID}/edit/cancelado/`, data, config_user)
        .then(response => {
          swal(
           { title: "Cancelado",
           text: "O pedido foi cancelado!",
           type: "success",
           animation: "slide-from-top",
           timer: 1000,
           showConfirmButton: true,
           confirmButtonText: 'OK',
           confirmButtonColor: "#001B5B",
         }, () => {
           // Redirect the user
           window.location.href = `/admin/${id}`;
         });
        })
        .catch((err) => {
          swal(
           { title: "Cancelado",
           text: "O pedido não foi cancelado!",
           type: "error",
           timer: 1000,
           showConfirmButton: true,
           confirmButtonText: 'OK',
           confirmButtonColor: "#001B5B",
         });
       });
    }
    );
  }

  ReservaSatatus(status){
      switch (status) {
        case 'P':
          return 'Pré-Reservado';
        break;
        case 'R':
          return 'Reservado';
        break;
        case 'C':
          return 'Cancelado';
        break;
      };
  }
  addZero(i) {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }

  DataFormat(data_string) {
    const d = new Date(data_string);
    const dia = d.getUTCDate();
    const mes = d.getUTCMonth() + 1;
    const ano = d.getFullYear();
    return (dia + '/' + mes + '/' + ano);
  }

  DataHoraFormat(data_string) {
    const d = new Date(data_string);
    const scale = d.getTimezoneOffset() / 60;
    const hora = d.getUTCHours() - scale;
    const minutos = this.addZero(d.getUTCMinutes());
    return (hora + ':' + minutos);
  }

  TrueFalseSimNao(bool) {
    if (bool) {
      return 'Sim';
    }else{
      return 'Não';
    }
  }

  render() {
    if (this.props.reserva && this.props.evento){
      const legislativo = this.TrueFalseSimNao(this.props.evento.legislativo);
      const video_conferencia = this.TrueFalseSimNao(this.props.evento.video_conferencia);
      const data_criacao = this.DataFormat(this.props.reserva.data_criacao);
      const data_inicio = this.DataFormat(this.props.evento.data_inicio);
      const hora_inicio = this.props.evento.hora_inicio;
      const data_fim = this.DataFormat(this.props.evento.data_fim);
      const hora_fim = this.props.evento.hora_fim;
      var recebido;
      if (this.props.reserva.recebido) {
        recebido = 'Oficializado';
      }else{
        recebido = 'Não oficializado';
      }
      var local;
      if (this.props.evento.local == 'SR') {
        local = 'Sala de Reuniões'
      }else{
        local = 'Auditório Interlegis'
      }
      switch (this.props.reserva.status) {
        case 'P':
            if (this.props.reserva.recebido) {
              return(
                <div key="TramitForm" className="col-md-10">
                  <h1 className="title" aling="center">
                    Pedido - {this.props.reserva.nr_referencia}
                  </h1>
                  <h3>Pedido feito em <strong>{data_criacao}</strong></h3>
                  <hr/>
                  <div className="padding-top-15">
                    <h1 className="title">Detalhes do Evento</h1>
                    <hr/>
                      <table className="col-md-12 text-reserva">
                        <tbody>
                          <tr>
                            <td><h4><strong>Nome: </strong>{this.props.evento.nome}</h4></td>
                            <td><h4><strong>Local: </strong>{local}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Legislativo: </strong>{legislativo}</h4></td>
                            <td><h4><strong>Data Inicio: </strong>{data_inicio}</h4></td>
                            <td><h4><strong>Hora Inicio: </strong>{hora_inicio}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Video Conferência: </strong>{video_conferencia}</h4></td>
                            <td><h4><strong>Data Fim: </strong>{data_fim}</h4></td>
                            <td><h4><strong>Hora Fim: </strong>{hora_fim}</h4></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  <TramitacaoFormalizacao
                    onCancelar={this.cancelarPedidoTramitacao}
                    authorize={['primeira_secretaria','admin']}
                    reserva={this.props.reserva} evento={this.props.evento}
                    onReservar={this.pedidoReservar}
                    id_={this.props.params.id}
                  />
                  {this.renderAlert()}
        	       </div>
              );
            }else{
              return(
                <div key="TramitPedRel" className="col-md-10">
                  <h1 className="title" aling="center">
                    Pedido - {this.props.reserva.nr_referencia}
                  </h1>
                  <h3>Pedido feito em <strong>{data_criacao}</strong></h3>
                  <hr/>
                  <div>
                    <h1 className="title">Detalhes do Evento</h1>
                    <hr/>
                      <table className="col-md-12 text-reserva">
                        <tbody>
                          <tr>
                            <td><h4><strong>Nome: </strong>{this.props.evento.nome}</h4></td>
                            <td><h4><strong>Local: </strong>{local}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Legislativo: </strong>{legislativo}</h4></td>
                            <td><h4><strong>Data Inicio: </strong>{data_inicio}</h4></td>
                            <td><h4><strong>Hora Inicio: </strong>{hora_inicio}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Video Conferência: </strong>{video_conferencia}</h4></td>
                            <td><h4><strong>Data Fim: </strong>{data_fim}</h4></td>
                            <td><h4><strong>Hora Fim: </strong>{hora_fim}</h4></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  <TramitacaoPedidoRealizado
                    onCancelar={this.cancelarPedidoTramitacao}
                    authorize={['primeira_secretaria','admin']}
                    reserva={this.props.reserva} evento={this.props.evento}
                    onPedidoRecebido={this.pedidoRecebido}
                  />
                  {this.renderAlert()}
        	       </div>
              );
            }
          break;
        case 'R':
            if (this.props.evento.publicado_agenda) {
              return(
                <div key="TramitPubAge" className="col-md-10">
                  <h1 className="title" aling="center">
                    Pedido - {this.props.reserva.nr_referencia}
                  </h1>
                  <h3>Pedido feito em <strong>{data_criacao}</strong></h3>
                  <hr/>
                  <div className="padding-top-15">
                    <h1 className="title">Detalhes do Evento</h1>
                    <hr/>
                      <table className="col-md-12 text-reserva">
                        <tbody>
                          <tr>
                            <td><h4><strong>Nome: </strong>{this.props.evento.nome}</h4></td>
                            <td><h4><strong>Local: </strong>{local}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Legislativo: </strong>{legislativo}</h4></td>
                            <td><h4><strong>Data Inicio: </strong>{data_inicio}</h4></td>
                            <td><h4><strong>Hora Inicio: </strong>{hora_inicio}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Video Conferência: </strong>{video_conferencia}</h4></td>
                            <td><h4><strong>Data Fim: </strong>{data_fim}</h4></td>
                            <td><h4><strong>Hora Fim: </strong>{hora_fim}</h4></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  <TramitacaoPublicacaoAgenda
                    onCancelar={this.cancelarPedidoTramitacao}
                    authorize={['primeira_secretaria','admin']}
                    reserva={this.props.reserva} evento={this.props.evento}
                  />
        	       </div>
              );
            }else{
              return(
                <div key="TramitAprov" className="col-md-10">
                  <h1 className="title" aling="center">
                    Pedido - {this.props.reserva.nr_referencia}
                  </h1>
                  <h3>Pedido feito em <strong>{data_criacao}</strong></h3>
                  <hr/>
                  <div className="padding-top-15">
                    <h1 className="title">Detalhes do Evento</h1>
                    <hr/>
                      <table className="col-md-12 text-reserva">
                        <tbody>
                          <tr>
                            <td><h4><strong>Nome: </strong>{this.props.evento.nome}</h4></td>
                            <td><h4><strong>Local: </strong>{local}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Legislativo: </strong>{legislativo}</h4></td>
                            <td><h4><strong>Data Inicio: </strong>{data_inicio}</h4></td>
                            <td><h4><strong>Hora Inicio: </strong>{hora_inicio}</h4></td>
                          </tr>
                          <tr>
                            <td><h4><strong>Video Conferência: </strong>{video_conferencia}</h4></td>
                            <td><h4><strong>Data Fim: </strong>{data_fim}</h4></td>
                            <td><h4><strong>Hora Fim: </strong>{hora_fim}</h4></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  <TramitacaoAprovado
                    onCancelar={this.cancelarPedidoTramitacao}
                    authorize={['primeira_secretaria','admin']}
                    reserva={this.props.reserva} evento={this.props.evento}
                  />
                  {this.renderAlert()}
        	       </div>
              );
            }
          break;
        case 'C':
          return(
            <div key="TramitAprov" className="col-md-10">
              <h1 className="title" aling="center">
                Pedido - {this.props.reserva.nr_referencia}
              </h1>
              <h3>Pedido feito em <strong>{data_criacao}</strong></h3>
              <hr/>
              <div className="padding-top-15">
                <h1 className="title">Detalhes do Evento</h1>
                <hr/>
                  <table className="col-md-12 text-reserva">
                    <tbody>
                      <tr>
                        <td><h4><strong>Nome: </strong>{this.props.evento.nome}</h4></td>
                        <td><h4><strong>Local: </strong>{local}</h4></td>
                      </tr>
                      <tr>
                        <td><h4><strong>Legislativo: </strong>{legislativo}</h4></td>
                        <td><h4><strong>Data Inicio: </strong>{data_inicio}</h4></td>
                        <td><h4><strong>Hora Inicio: </strong>{hora_inicio}</h4></td>
                      </tr>
                      <tr>
                        <td><h4><strong>Video Conferência: </strong>{video_conferencia}</h4></td>
                        <td><h4><strong>Data Fim: </strong>{data_fim}</h4></td>
                        <td><h4><strong>Hora Fim: </strong>{hora_fim}</h4></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              <TramitacaoPedidoCancelado
                onCancelar={this.cancelarPedidoTramitacao}
                authorize={['primeira_secretaria','admin']}
                reserva={this.props.reserva} evento={this.props.evento}
              />
              {this.renderAlert()}
            </div>
          );
          break;
        default:
      }
    }
    return(
      <h2 className="title">Carregando...</h2>
    );
  }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function DataFormat(data_string) {
  const d = new Date(data_string);
  const dia = addZero(d.getUTCDate());
  const mes = addZero(d.getUTCMonth() + 1);
  const ano = addZero(d.getFullYear());
  return (ano + '-' + mes + '-' + dia);
}

function mapStateToProps(state){
  return {
    reserva: state.pedido_detail.reserva_id,
    evento: state.pedido_detail.evento_id,
    errorMessage: state.authentication.error
  }
}

export default connect(mapStateToProps,
  { getPedidoEvento, getUsuario, formalizarPedido, reservarPedido, cancelarPedido })(Admin_Area);
