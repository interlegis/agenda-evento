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

      evento['start'] = new Date(date_inicial[0], date_inicial[1],
        date_inicial[2], time_inicial[0], time_inicial[1], time_inicial[2]);

      evento['end'] = new Date(date_fim[0], date_fim[1],
        date_fim[2], time_fim[0], time_fim[1], time_fim[2]);
      return evento;
    });

    this.setState({neweventos: events});
  }

  render() {
    console.log(new Date(1376145058 * 1000));
    console.log(this.props.eventos);
    console.log(this.state.neweventos);

    return (
      <div className="calendar-page col-md-12">
      <h1 align="center">Agenda de Eventos Intergelis</h1>
        <BigCalendar
          popup
           events={this.state.neweventos}
           views={['month', 'week', 'agenda']}
           messages={{next:"Próximo",previous:"Anterior",today:"Hoje"}}
           onSelectEvent={event => this.context.router.push('/evento/'+event._id)}
           culture={moment.locale('pt')}
         />
      </div>
    );
  }
}

function mapStateToProps(state){
  console.log(state.calendar);
  return { eventos: state.calendar };
}

export default connect(mapStateToProps, { getAgendaPedidos })(Agenda);
