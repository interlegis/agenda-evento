import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { getAgendaPedidos } from '../actions/pedido-evento/pedido';
import { connect } from 'react-redux';

BigCalendar.momentLocalizer(moment);

class Agenda extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount(){
    this.props.getAgendaPedidos();
  }

  render() {
    console.log(this.props.eventos);
    return (
      <div className="calendar-page col-md-12">
      <h1 align="center">Agenda de Eventos Intergelis</h1>
        <BigCalendar
          popup
           events={this.props.eventos}
           views={['month']}
           messages={{next:"Próximo",previous:"Anterior",today:"Hoje"}}
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

export default connect(mapStateToProps, { getAgendaPedidos })(Agenda);
