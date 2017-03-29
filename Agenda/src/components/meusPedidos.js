import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from '../actions';

class MeusPedidos extends Component {
  componentWillMount() {
    this.props.getPedidos();
  }

  deletePedido(id){
    this.props.deletarPedido(id);
  }

  render() {
    if(this.props.pedidos){
      var itensTabela = this.props.pedidos.map( function(pedido) {
        console.log(pedido);
        var status;
          switch (pedido.status) {
            case 'P':
              status = 'Pré-Reservado';
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
            <td>
              <div>
                <button
                  className="btn btn-default btn-sm space"
                  onClick={() => console.log(pedido.id)}
                >
                  Editar Pedido
                </button>
                <button
                  className="btn btn-danger btn-sm space"
                  onClick={() => this.deletePedido(pedido.id)}
                >
                  Deletar Pedido
                </button>
              </div>
            </td>
          </tr>
        );
      }, this);
      return(
        <table className="table table-bordered col-md-10">
          <thead className="thead-default">
            <tr>
              <th>N</th>
              <th>Nome do Evento</th>
              <th>N de Ref.</th>
              <th>Status</th>
              <th>Data de Criação</th>
              <th>Hora de Criação</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {itensTabela}
          </tbody>
        </table>
      );
    }

    return (
      <div className="cp-spinner cp-morph"></div>
    );
  }
}

function mapStateToProps(state){
  return {pedidos: state.pedidos.pedidos }
}

export default connect(mapStateToProps, actions)(MeusPedidos);
