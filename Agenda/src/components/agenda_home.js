import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import _ from 'lodash';
import { getAgendaPedidos } from '../actions/pedido-evento/pedido';
import { connect } from 'react-redux';
import { Link } from 'react-router';

moment.locale('pt-br');

BigCalendar.momentLocalizer(moment);

class AgendaHome extends Component {
  constructor(props) {
        super(props);
        this.state = { neweventos: [] };
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount(){
    this.props.getAgendaPedidos();
  }

  componentWillReceiveProps(newProps) {
    var events = _.cloneDeep(newProps.eventos);
    _.map(events, (evento) => {
      var date_inicial = evento['start'].split("-");
      var date_fim = evento['end'].split("-");
      var time_inicial = evento['start_hour'].split(":");
      var time_fim = evento['end_hour'].split(":");

      evento['start'] = new Date(Number(date_inicial[0]),
        (Number(date_inicial[1]) - 1), Number(date_inicial[2]), Number(time_inicial[0]),
        Number(time_inicial[1]));

      evento['end'] = new Date(Number(date_fim[0]), (Number(date_fim[1]) - 1),
        Number(date_fim[2]), Number(time_fim[0]), Number(time_fim[1]));
        var local;
        if (evento['lugar'] == 'SR') {
          local = 'Sala de Reuniões'
        }else{
          local = 'Auditório Interlegis'
        }
        evento['title'] = evento['title'] + ' - ' + local + ' ('
        + time_inicial[0] + ':' + time_inicial[1] + ' - '
        + time_fim[0] + ':' + time_fim[1] + ')';
        return evento;
    });
    this.setState({neweventos: events});
  }

  render() {
    return (
      <div className="calendar-page col-md-12">
      <h2 className="title">Agenda de Eventos Interlegis</h2>
      <h3>Sistema para agendamento de eventos a serem realizados no prédio Interlegis</h3>
      <div className="space-30"></div>
      <BigCalendar
         popup
         events={this.state.neweventos}
         views={['month', 'week', 'agenda']}
         messages={{next:"Próximo",previous:"Anterior",today:"Hoje",month: "Mês",
                    week: "Semana", agenda: "Agenda"}}
         components={
         {
          event: Event,
          agenda: {
            event: EventAgenda
          }
         }
        }
         onSelectEvent={event => this.context.router.push('/evento/'+event.reserva_id)}
         culture={moment.locale('pt-br')}
       />
         <div className="space-50"></div>
      </div>
    );
  }
}

function Event({ event }) {
  return (
    <span>
      <strong>
      {event.title}
      </strong>
    </span>
  )
}

function EventAgenda({ event }) {
  return(
    <span>
      <em style={{ color: '#26528C'}}>{event.title}</em>
    </span>
  );
}

function mapStateToProps(state){
  return { eventos: state.calendar };
}

export default connect(mapStateToProps, { getAgendaPedidos })(AgendaHome);
