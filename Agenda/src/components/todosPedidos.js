import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'react-data-components';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getTodosPedidos, getPedidoEvento, deletarPedido }
from '../actions/pedido-evento/pedido';
import { getUsuario } from '../actions';
import { AuthorizedComponent } from 'react-router-role-authorization';

class TodosPedidos extends AuthorizedComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.getUsuario();
    this.props.getTodosPedidos();
  }

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
            title: "Operação realizada com sucesso",
            text: "Pedido deletado.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
            }
          );
        } else {
          swal({
          title: "Cancelado",
          text: "Seu pedido não foi cancelado!",
          type: "error",
          timer: 2000,
          showConfirmButton: false
          });
        }
      });
  }

  addZero(i) {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }

  render() {
    if(this.props.pedidos){
        const renderButtonsAdmin =
          (val, row) => {
            return (
              <div>
                <button
                  className="btn btn-primary btn-sm space"
                  onClick={() => {
                    this.props.getPedidoEvento(row['id']);
                    this.context.router.replace(`/admin/${row['id']}`);
                  }}
                >
                  Tramitar Pedido
                </button>
                <button
                  className="btn btn-default btn-sm space"
                  onClick={() => {
                    this.props.getPedidoEvento(row['id']);
                    this.context.router.replace(`/evento/editar/${row['id']}`);
                  }}
                >
                  Editar Pedido
                </button>
                <button
                  className="btn btn-danger btn-sm space"
                  onClick={() => {
                    this.deletePedido(row['id']);
                  }}
                >
                  Deletar Pedido
                </button>
              </div>
            );
          };

      const renderLink =
      (val, row) =>{
        return(
          <Link to={"/evento/" + row['id']}>{row['referencia']}</Link>
        );
      };

      const tableColumns = [
        { title: 'Nome do Evento', prop: 'nome', className: 'text-center' },
        { title: 'N de Ref.', render: renderLink, className: 'text-center' },
        { title: 'Status', prop: 'status', className: 'text-center' },
        { title: 'Data de Criação', prop: 'data', className: 'text-center'},
        { title: 'Hora de Criação', prop: 'hora', className: 'text-center'},
        { title: 'Opções',
        render: renderButtonsAdmin ,
        className: 'text-center' },
      ];

      var data = this.props.pedidos.map((pedido) => {
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
        const scale = d.getTimezoneOffset() / 60;
        const hora = this.addZero(d.getUTCHours() - scale);
        const minutos = this.addZero(d.getUTCMinutes()) ;
        const hora_criacao =  hora + ':' + minutos;

        return {
          "id": pedido.id,
          "nome": pedido.evento.nome,
          "referencia": pedido.nr_referencia,
          "status": status,
          "data": data,
          "hora": hora_criacao
        };
      });

      return(
        <div>
          <h1 className="center-div title">Pedidos e Tramitações</h1>
          <DataTable
           className="container"
           keys="id"
           columns={tableColumns}
           initialData={data}
           initialPageLength={10}
           initialSortBy={{ prop: 'data', order: 'descending' }}
           pageLengthOptions={[ 5, 10, 15 ]}
           />
       </div>
      );
    }
    return (
      <h2 className="title">Carregando...</h2>
    );
  }
}

function mapStateToProps(state){
  return {
    pedidos: state.pedidos.todosPedidos,
  }
}

export default connect(mapStateToProps,
  { getTodosPedidos, getPedidoEvento, deletarPedido, getUsuario })(TodosPedidos);
