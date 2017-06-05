import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUsuario, updatePedido, getPedidoEvento, formalizarPedido, reservarPedido }
from '../actions';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

import TramitacaoFormalizacao from './tramitacao/tramitacaoFormalizacao';
import TramitacaoPublicacaoAgenda from './tramitacao/tramitacaoPublicacaoAgenda';
import TramitacaoAprovado from './tramitacao/tramitacaoAprovado';
import TramitacaoPedidoRealizado from './tramitacao/tramitacaoPedidoRealizado';

class Admin_Area extends AuthorizedComponent {
  constructor(props) {
    super(props);

    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));

    this.notAuthorizedPath = '/not-found';
    this.pedidoRecebido = this.pedidoRecebido.bind(this);
    this.updatePedido = this.updatePedido.bind(this);
    this.pedidoReservar = this.pedidoReservar.bind(this);
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    this.props.getUsuario();
    this.props.getPedidoEvento(this.props.params.id);
  }

  renderAlert(){
    console.log(this.props.errorMessage);
    if (this.props.errorMessage) {
      return(
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  pedidoRecebido(){
    this.props.formalizarPedido(this.props.params.id);
    this.props.getPedidoEvento(this.props.params.id);
  }

  pedidoReservar(){
    this.props.reservarPedido(this.props.params.id);
  }

  updatePedido(){
    const data = {
      "nome": this.props.evento.nome,
      "descricao": this.props.evento.descricao,
      "local": this.props.evento.local,
      "data_inicio": DataFormat(this.props.evento.data_inicio),
      "hora_inicio": this.props.evento.hora_inicio,
      "data_fim": DataFormat(this.props.evento.data_fim),
      "hora_fim": this.props.evento.hora_fim,
      "legislativo": this.props.evento.legislativo,
      "observacao": this.props.evento.observacao,
      "publicado_agenda": true,
      "video_conferencia": this.props.evento.video_conferencia,
      "nome_responsavel": this.props.evento.responsavel.nome,
      "email_responsavel": this.props.evento.responsavel.email,
      "telefone_responsavel": this.props.evento.responsavel.telefone,
      "lotacao_responsavel": this.props.evento.responsavel.lotacao
    }

    this.props.updatePedido(data, this.props.params.id);
  }

  ReservaSatatus(status){
      switch (status) {
        case 'P':
          return 'Pre-Reservado';
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
      const status = this.ReservaSatatus(this.props.reserva.status);
      const legislativo = this.TrueFalseSimNao(this.props.evento.legislativo);
      const video_conferencia = this.TrueFalseSimNao(this.props.evento.video_conferencia);
      const data_criacao = this.DataFormat(this.props.reserva.data_criacao);
      const hora_criacao = this.DataHoraFormat(this.props.reserva.data_criacao);
      const data_inicio = this.DataFormat(this.props.evento.data_inicio);
      const hora_inicio = this.props.evento.hora_inicio;
      const data_fim = this.DataFormat(this.props.evento.data_fim);
      const hora_fim = this.props.evento.hora_fim;
      var recebido;
      if (this.props.reserva.recebido) {
        recebido = 'Oficializado'
      }else{
        recebido = 'Não oficializado'
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
                    <h3>Pedido feito em <strong>/strong>{data_criacao}</strong></h3>
                  </h1>
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
                    authorize={['primeira_secretaria','admin']}
                    reserva={this.props.reserva} evento={this.props.evento}
                    onUpdate={this.updatePedido}
                  />
                  {this.renderAlert()}
        	       </div>
              );
            }
          break;
        case 'C':

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
  { getPedidoEvento, updatePedido, getUsuario, formalizarPedido, reservarPedido })(Admin_Area);
