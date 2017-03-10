import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from '../actions';

class EventoDatail extends Component {
  componentWillMount() {
    this.props.getPedidoEvento(this.props.params.id);
  }

  render() {
    if (this.props.reserva && this.props.evento){
      console.log(this.props.evento);
      var status;
        switch (this.props.reserva.status) {
          case 'P':
            status = 'Pre-Reservado';
          break;
          case 'R':
            status = 'Reservado';
          break;
          case 'C':
            status = 'Cancelado';
          break;
        }
      const d = new Date(this.props.reserva.data_criacao);
      const dia = d.getUTCDate();
      const mes = d.getUTCMonth() + 1;
      const ano = d.getFullYear();
      const data = dia + '/' + mes + '/' + ano;
      const hora = d.getUTCHours();
      const minutos = d.getUTCMinutes();
      const hora_criacao =  hora + ':' + minutos;
      var recebido;
      if (this.props.reserva.recebido) {
        recebido = 'Recebido'
      }else{
        recebido = 'Nao oficializado'
      }
      var legislativo;
      if (this.props.reserva.legislativo) {
        legislativo = 'Sim'
      }else{
        legislativo = 'Não'
      }
      var video_conferencia;
      if (this.props.reserva.video_conferencia) {
        video_conferencia = 'Sim'
      }else{
        video_conferencia = 'Não'
      }
      return(
        <div className="col-md-10">
          <h1>Pedido - {this.props.reserva.nr_referencia}</h1>
          <hr/>
          <div>
            <h3>Reserva</h3>
            <table className="col-md-12">
              <tbody>
                <tr>
                  <td><h4><strong>Status: </strong>{status}</h4></td>
                  <td><h4><strong>Recebido: </strong>{recebido}</h4></td>
                </tr>
                <tr>
                  <td><h4><strong>Data: </strong>{data}</h4></td>
                  <td><h4><strong>Hora: </strong>{hora_criacao}</h4></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="div-evento">
            <h3>Evento</h3>
              <table className="col-md-12">
                <tbody>
                  <tr>
                    <td><h4><strong>Nome: </strong>{this.props.evento.nome}</h4></td>
                    <td><h4><strong>Local: </strong>{this.props.evento.local}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Descrição: </strong>{this.props.evento.descricao}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Data Inicio: </strong>{this.props.evento.data_inicio}</h4></td>
                    <td><h4><strong>Hora Inicio: </strong>{this.props.evento.hora_inicio}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Data Fim: </strong>{this.props.evento.data_fim}</h4></td>
                    <td><h4><strong>Hora Fim: </strong>{this.props.evento.hora_fim}</h4></td>
                  </tr>
                  <tr>
                    <td><h4><strong>Legislativo: </strong>{legislativo}</h4></td>
                    <td><h4><strong>Video Conferência: </strong>{video_conferencia}</h4></td>
                  </tr>
                </tbody>
              </table>
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
