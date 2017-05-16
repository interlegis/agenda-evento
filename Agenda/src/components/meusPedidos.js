import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getPedidos, getPedidoEvento, deletarPedido }
from '../actions/pedido-evento/pedido';

class MeusPedidos extends Component {
  componentWillMount() {
    this.props.getPedidos();
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  deletePedido(id) {
    swal({
      title: "Deletar Pedido",
      text: "Deseja realmente deletar o Pedido?",
      type: "warning",
      animation: "slide-from-top",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      closeOnConfirm: false,
      closeOnCancel: false,
      confirmButtonText: "Deletar",
      showLoaderOnConfirm: true,
    }, (isConfirm) =>
      {
        if (isConfirm) {
          this.props.deletarPedido(id);
          swal(
            {
            title: "Sweet!",
            text: "Pedido deletado.",
            type: "success",
            showConfirmButton: false
            }
          );
          window.location.href = "/main";
        } else {
          swal({
          title: "Cancelado",
          text: "Seu pedido nao foi cancelado ¯\\_(ツ)_/¯",
          type: "error",
          timer: 2000,
          showConfirmButton: false
          });
        }
      });
  }

  render() {
    if(this.props.pedidos){
      var itensTabela = this.props.pedidos.map( function(pedido) {
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
                onClick={() => {
                  this.props.getPedidoEvento(pedido.id);
                  this.context.router.replace(`/evento/editar/${pedido.id}`);
                }}
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
        <h3>Carregando...</h3>
    );
  }
}

function mapStateToProps(state){
  return {pedidos: state.pedidos.pedidos }
}

export default connect(mapStateToProps,
  { getPedidos, getPedidoEvento, deletarPedido })(MeusPedidos);
