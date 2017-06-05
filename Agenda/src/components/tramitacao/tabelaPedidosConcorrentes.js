import React, { Component } from 'react';

export default class TabelaPedidosConcorrentes extends Component{
  render() {
    if (this.props.pedidos == null) {
      return (
        <div className="col-md-10 col-md-offset-1">
              <h1 className="center">Eventos Pré-Reservados Concorrentes</h1>
              <h4 className="center">Nenhum evento pré-reservado nessas datas.</h4>
        </div>
      );
    }
    console.log(this.props.id_);
    if (this.props.pedidos[0].id == this.props.id_) {
      return (
        <div className="col-md-10 col-md-offset-1">
              <h1 className="center">Eventos Pré-Reservados Concorrentes</h1>
              <h4 className="center">Nenhum evento pré-reservado nessas datas.</h4>
        </div>
      );
    }
    var itensTabela = this.props.pedidos.map( function(pedido) {
      const data_inicio = pedido.evento.data_inicio;
      const hora_inicio = pedido.evento.hora_inicio;
      const data_fim = pedido.evento.data_fim;
      const hora_fim = pedido.evento.hora_fim;
      return (
        <tr key={pedido.evento.nome}>
          <th>{pedido.evento.nome}</th>
          <th>{pedido.nr_referencia}</th>
          <th>{data_inicio} - {hora_inicio}</th>
          <th>{data_fim} - {hora_fim}</th>
        </tr>
      );
    });
    return (
      <div className="col-md-10 col-md-offset-1">
          <h1>Eventos Pré-Reservados Concorrentes</h1>
          <table className="table-bordered table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>N de Ref</th>
                <th>Data Início</th>
                <th>Data Fim</th>
              </tr>
            </thead>
            <tbody>
              {itensTabela}
            </tbody>
          </table>
      </div>
    );
  }
}
