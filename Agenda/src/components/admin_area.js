import React from 'react';
import { connect } from 'react-redux';
import { getUsuario, getPedidoEvento } from '../actions';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

import TramitacaoFormalizacao from './tramitacao/tramitacaoFormalizacao';
import tramitacaoPublicacaoAgenda from './tramitacao/tramitacaoPublicacaoAgenda';
import TramitacaoAprovado from './tramitacao/tramitacaoAprovado';
import TramitacaoPedidoRealizado from './tramitacao/tramitacaoPedidoRealizado';

class Admin_Area extends AuthorizedComponent {
  constructor(props) {
    super(props);
    this.userRoles = (((Cookies.get('roles') === undefined) ||
    ((Cookies.get('roles') === null))) ? [] :
    JSON.parse(Cookies.get('roles')));
    this.notAuthorizedPath = '/not-found';
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

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
                <div className="col-md-10">
                  <h1 className="title" aling="center">Pedido - {this.props.reserva.nr_referencia}</h1>
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
                  </div>
                  <TramitacaoFormalizacao authorize={['primeira_secretaria','admin']}/>
        	       </div>
              );
            }else{
              return(
                <div className="col-md-10">
                  <h1 className="title" aling="center">Pedido - {this.props.reserva.nr_referencia}</h1>
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
                  </div>
                  <TramitacaoPedidoRealizado authorize={['primeira_secretaria','admin']}/>
        	       </div>
              );
            }
          break;
        case 'R':
            if (this.props.evento.publicado_agenda) {
              return(
                <div className="col-md-10">
                  <h1 className="title" aling="center">Pedido - {this.props.reserva.nr_referencia}</h1>
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
                  </div>
                  <tramitacaoPublicacaoAgenda authorize={['primeira_secretaria','admin']}/>
        	       </div>
              );
            }else{
              return(
                <div className="col-md-10">
                  <h1 className="title" aling="center">Pedido - {this.props.reserva.nr_referencia}</h1>
                  <hr/>
                  <div>
                    <h1 className="title">Reserva</h1>
                    <hr/>
                  </div>
                  <TramitacaoAprovado authorize={['primeira_secretaria','admin']}/>
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

function mapStateToProps(state){
  return {
    reserva: state.pedido_detail.reserva_id,
    evento: state.pedido_detail.evento_id
  }
}

export default connect(mapStateToProps, { getPedidoEvento, getUsuario })(Admin_Area);
