import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import _ from 'lodash';
import { getAgendaPedidos } from '../actions/pedido-evento/pedido';
import { connect } from 'react-redux';

BigCalendar.momentLocalizer(moment);

class Agenda extends Component {
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

      evento['start'] = new Date(date_inicial[0],
        (Number(date_inicial[1]) - 1).toString(),date_inicial[2], time_inicial[0],
        time_inicial[1], time_inicial[2]);

      evento['end'] = new Date(date_fim[0], (Number(date_fim[1]) - 1).toString(),
        date_fim[2], time_fim[0], time_fim[1], time_fim[2]);

      return evento;
    });

    this.setState({neweventos: events});
  }

  render() {
    console.log(this.props.eventos);
    console.log(this.state.neweventos);

    return (
      <div className="calendar-page col-md-12">
      <h1 align="center">Agenda de Eventos Intergelis</h1>
        <BigCalendar
           popup
           events={this.state.neweventos}
           views={['month', 'week', 'agenda']}
           messages={{next:"Próximo",previous:"Anterior",today:"Hoje",month: "Mês",
                      week: "Semana", agenda: "Agenda"}}
           components={{
            event: Event,
            agenda: {
              event: EventAgenda
            }
            }}
           onSelectEvent={event => this.context.router.push('/evento/'+event._id)}
           culture={moment.locale('pt')}
         />
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
      { event.descricao && (':  ' + event.descricao)}
    </span>
  )
}

function EventAgenda({ event }) {
  return(
    <span>
      <em style={{ color: '#26528C'}}>{event.title}</em>
      <p>{ event.descricao }</p>
    </span>
  );
}

function mapStateToProps(state){
  return { eventos: state.calendar };
}

export default connect(mapStateToProps, { getAgendaPedidos })(Agenda);