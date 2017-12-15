import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getUsuario } from '../actions';
import { FIELD_FAQ, FIELD_FAQ2 } from './forms/faq_types';

class Faq extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.props.getUsuario();
    }
  }

  renderItems(itemConfig) {
    return(
      <li key={`${itemConfig}`} className="list-group-item">{itemConfig}</li>
    );
  }

  renderPanel(panelConfig) {
    return(
      <div key={`${panelConfig.id}\_${panelConfig.parentid}`} className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">
            <a data-toggle="collapse" data-parent={`#${panelConfig.parentid}`} href={`#${panelConfig.id}`} className="">
              {panelConfig.titulo}
            </a>
          </h4>
        </div>
        <div id={`${panelConfig.id}`} className="panel-collapse collapse" style={{height: `0px`,}}>
          <div className="panel-body">
            <ul className="list-group">
              {_.map(panelConfig.items, this.renderItems.bind(this))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  render(){
    return(
      <div className="container">
        <div className="row">
          <div className="section-title item_bottom text-center" style={{
            opacity: `1`,
            bottom: `0px`,
          }}>
            <div>
              <span className="fa fa-cogs fa-2x"></span>
            </div>
            <h1 className="white">Perguntas&<span>Respostas</span>
            </h1>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2 className="faqh">Pedidos</h2>
            <div className="panel-group" id="accordion-1">
              {_.map(FIELD_FAQ, this.renderPanel.bind(this))}
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2 className="faqh">Agenda</h2>
            <div className="panel-group" id="accordion-2">
              {_.map(FIELD_FAQ2, this.renderPanel.bind(this))}
            </div>
          </div>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    authenticated: state.authentication.authenticated
  };
}

export default connect(mapStateToProps, { getUsuario })(Faq);
