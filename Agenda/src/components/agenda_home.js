import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { getAgendaPedidos } from '../actions/pedido-evento/pedido';
import { connect } from 'react-redux';

BigCalendar.momentLocalizer(moment);

class AgendaHome extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount(){
    this.props.getAgendaPedidos();
  }

  render() {
    return (
      <div className="calendar-page month-page">
      <h1>Agenda de Eventos Intergelis</h1>
      <h3>Sistema para agendamento de eventos a serem realizados no prédio Interlegis</h3>
        <BigCalendar
          popup
           events={this.props.eventos}
           views={['month','week']}
           messages={{next:"Próximo",previous:"Anterior",today:"Hoje",month: "Mês",
                      week: "Semana"}}
           onSelectEvent={event => this.context.router.push('/evento/'+event.id)}
           culture={moment.locale('pt')}
         />
      </div>
    );
  }
}

function mapStateToProps(state){
  return { eventos: state.calendar };
}

export default connect(mapStateToProps, { getAgendaPedidos })(AgendaHome);
