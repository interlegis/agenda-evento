import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAgendaPedidosNews } from '../actions/pedido-evento/pedido';

class Home extends Component {
  componentWillMount(){
    this.props.getAgendaPedidosNews();
  }

  render() {
    if (this.props.eventos.length > 0) {
      var cards = this.props.eventos.map( function(evento) {
        var local;
        var data_inicio = evento.start.split("-");
        var data_fim = evento.end.split("-");
        var hora_inicio = evento.start_hour.split(":");
        var hora_fim = evento.end_hour.split(":");

        if (evento.lugar == 'SR') {
          local = 'Sala de Reuniões'
        } else{
          local = 'Auditório Interlegis'
        }

        return(
          <div className="col-md-4 col-sm-6 col-xs-7" key={evento.title+local}>
              <div className="card-container">
                 <div className="card">
                     <div className="front">
                         <div className="cover">
                          <img alt="Brand_card" src="/style/img/interlegis2.jpg"/>
                         </div>
                         <div className="content">
                             <div className="main">
                                 <h3 className="name">{evento.title}</h3>
                                 <p className="profession">Local: {local}</p>
                                 <h5 className="motto">Data de Inicio</h5>
                                 <p className="text-center">
                                   {`${data_inicio[2]}/${data_inicio[1]}/${data_inicio[0]}`}
                                 </p>
                                 <h5 className="motto">Data de Termino</h5>
                                 <p className="text-center">
                                    {`${data_fim[2]}/${data_fim[1]}/${data_fim[0]}`}
                                 </p>
                             </div>
                         </div>
                     </div>
                     <div className="back">
                         <div className="content">
                             <div className="main">
                                 <h3 className="name">Sobre o Evento</h3>
                                 <p className="profession">
                                   <a href="mailto:atendimento@interlegis.leg.br"
                                   target="_self">
                                      atendimento@interlegis.leg.br
                                   </a>
                                 </p>
                                 <p className="text-center">
                                 {evento.description}
                                 </p>
                                 <div className="stats-container">
                                      <div className="stats">
                                          <h4>{`${hora_inicio[0]}:${hora_inicio[1]}`}</h4>
                                          <p>
                                               Inicio
                                          </p>
                                      </div>
                                      <div className="stats">
                                          <h4>{`${hora_fim[0]}:${hora_fim[1]}`}</h4>
                                          <p>
                                              Termino
                                          </p>
                                      </div>
                                      <div className="stats">
                                          <h4>Previsto</h4>
                                          <p>
                                              Status
                                          </p>
                                      </div>
                                  </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
        );
      });

      return (
        <div className="row">
        <h1 className="title">Agenda de Eventos Intergelis</h1>
        <h3>
        Sistema para agendamento de eventos a serem realizados no prédio Interlegis
        </h3>
        <div className="space-30"></div>
        <div className="col-sm-10 col-md-12 col-xs-11">
          {cards}
        </div>
      </div>
      );
    }
    return (
      <h3>Carregando...</h3>
    );
  }
}

function mapStateToProps(state) {
    return { eventos: state.calendar };
}

export default connect(mapStateToProps, { getAgendaPedidosNews })(Home);
