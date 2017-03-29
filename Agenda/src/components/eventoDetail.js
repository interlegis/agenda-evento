import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from '../actions';

class EventoDatail extends Component {
  componentWillMount() {
    this.props.getPedidoEvento(this.props.params.id);
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

  DataFormat(data_string) {
    const d = new Date(data_string);
    const dia = d.getUTCDate();
    const mes = d.getUTCMonth() + 1;
    const ano = d.getFullYear();
    return (dia + '/' + mes + '/' + ano);
  }

  DataHoraFormat(data_string) {
    const d = new Date(data_string);
    const hora = d.getUTCHours();
    const minutos = d.getUTCMinutes();
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
        recebido = 'Recebido'
      }else{
        recebido = 'Não oficializado'
      }
      var local;
      if (this.props.evento.local == 'SR') {
        local = 'Sala de Reuniões'
      }else{
        local = 'Auditório Interlegis'
      }
      return(
        <div className="col-md-10">
          <h1 aling="center">Pedido - {this.props.reserva.nr_referencia}</h1>
          <hr/>
          <div>
            <h1>Reserva</h1>
            <hr/>
            <table className="col-md-12">
              <tbody>
                <tr>
                  <td><h4><strong>Status: </strong>{status}</h4></td>
                  <td><h4><strong>Recebido: </strong>{recebido}</h4></td>
                </tr>
                <tr>
                  <td><h4><strong>Data: </strong>{data_criacao}</h4></td>
                  <td><h4><strong>Hora: </strong>{hora_criacao}</h4></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="div-evento">
            <h1>Evento</h1>
            <hr/>
              <table className="col-md-12">
                <tbody>
                  <tr>
                    <td><h4><strong>Nome: </strong>{this.props.evento.nome}</h4></td>
                    <td><h4><strong>Local: </strong>{local}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Descrição: </strong>{this.props.evento.descricao}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Data Inicio: </strong>{data_inicio}</h4></td>
                    <td><h4><strong>Hora Inicio: </strong>{hora_inicio}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Data Fim: </strong>{data_fim}</h4></td>
                    <td><h4><strong>Hora Fim: </strong>{hora_fim}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Legislativo: </strong>{legislativo}</h4></td>
                    <td><h4><strong>Video Conferência: </strong>{video_conferencia}</h4></td>
                  </tr>
                </tbody>
              </table>
            </div>
              <div className="div-evento-responsavel">
                <h1>Responsável</h1>
                <hr/>
                  <table className="col-md-12">
                    <tbody>
                      <tr>
                        <td><h4><strong>Nome: </strong>{this.props.evento.responsavel.nome}</h4></td>
                        <td><h4><strong>Email: </strong>{this.props.evento.responsavel.email}</h4></td>
                      </tr>
                      <tr>
                        <td><h4><strong>Telefone: </strong>{this.props.evento.responsavel.telefone}</h4></td>
                        <td><h4><strong>Lotação: </strong>{this.props.evento.responsavel.lotacao}</h4></td>
                      </tr>
                    </tbody>
                  </table>
                <div className="btn-pedido col-md-12" role="group">
                    <button className="btn btn-primary btn-lg space">
                      Editar Pedido
                    </button>
                    <button className="btn btn-default btn-lg space">
                      Ajuda
                    </button>
                </div>
              </div>
        </div>
      );
    }
    return(
      <h3>Carregando</h3>
    );
  }
}

function mapStateToProps(state){
  return {
    reserva: state.pedido_detail.reserva_id,
    evento: state.pedido_detail.evento_id
  }
}

export default connect(mapStateToProps, actions)(EventoDatail);
