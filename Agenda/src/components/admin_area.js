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
      switch (this.props.reserva.status) {
        case 'P':
            if (this.props.reserva.recebido) {
              return(
                <div key="TramitForm" className="col-md-10">
                  <h1 className="title" aling="center">
                    Pedido - {this.props.reserva.nr_referencia}
                  </h1>
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
                  </div>
                  <TramitacaoFormalizacao
                    authorize={['primeira_secretaria','admin']}
                    reserva={this.props.reserva} evento={this.props.evento}
                    onReservar={this.pedidoReservar}
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
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
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
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
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
                  </h1>
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
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
