import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAgendaPedidos } from '../actions/pedido-evento/pedido';

class Home extends Component {
  componentWillMount(){
    this.props.getAgendaPedidos();
  }

  render() {
    var cards = this.props.eventos.map( function(evento) {
      var local;
      if (evento.local == 'SR') {
        local = 'Sala de Reuniões'
      }else{
        local = 'Auditório Interlegis'
      }
      return(
        <div className="w3-card-4" key={evento.title+local  }>
            <header className="w3-container w3-light-grey">
              <h3>{evento.title}</h3>
            </header>
            <div className="w3-container">
              <p><strong>Local:</strong> {local}</p>
              <hr/>
              <p>{evento.description}</p><br/>
            </div>
          <button className="w3-button w3-block w3-dark-grey">Sobre!</button>
        </div>
      );
    });

    return (
      <div className="calendar-page">
      <h1>Agenda de Eventos Intergelis</h1>
      <h3>Sistema para agendamento de eventos a serem realizados no prédio Interlegis</h3>
      <div className="list-cards-eventos">
        {cards}
      </div>
    </div>
    );
  }
}

function mapStateToProps(state) {
    return { eventos: state.calendar };
}

export default connect(mapStateToProps, { getAgendaPedidos })(Home);
