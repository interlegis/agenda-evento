import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from '../actions';

class MeusPedidos extends Component {
  componentWillMount() {
    this.props.getPedidos();
  }

  render() {
    if(this.props.pedidos){
      var itensTabela = this.props.pedidos.map( function(pedido) {
        console.log(pedido);
        var status;
          switch (pedido.status) {
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
        const d = new Date(pedido.data_criacao);
        const dia = d.getUTCDate();
        const mes = d.getUTCMonth() + 1;
        const ano = d.getFullYear();
        const data = dia + '/' + mes + '/' + ano;
        const hora = d.getUTCHours();
        const minutos = d.getUTCMinutes();
        const hora_criacao =  hora + ':' + minutos;
        return(
          <tr key={pedido.id}>
            <td >{pedido.id}</td>
            <td>{pedido.evento.nome}</td>
            <td><Link to={"/evento/" + pedido.id}>{pedido.nr_referencia}</Link></td>
            <td>{status}</td>
            <td>{data}</td>
            <td>{hora_criacao}</td>
          </tr>
        );
      });
      return(
        <table className="table table-bordered col-md-10">
          <thead className="thead-default">
            <tr>
              <th>N</th>
              <th>Nome do Evento</th>
              <th>N de Ref.</th>
              <th>Status</th>
              <th>Data de Criacao</th>
              <th>Hora de Criacao</th>
            </tr>
          </thead>
          <tbody>
            {itensTabela}
          </tbody>
        </table>
      );
    }
    return(
      <h3>Carregando...</h3>
    );
  }
}

function mapStateToProps(state){
  return {pedidos: state.pedidos.pedidos }
}

export default connect(mapStateToProps, actions)(MeusPedidos);