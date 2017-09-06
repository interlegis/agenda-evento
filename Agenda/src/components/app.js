import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUsuario } from '../actions';
import Navbar from './navbar';

class App extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.props.getUsuario();
    }
  }

  render() {
    return (
      <div>
        <Navbar authorize={['primeira_secretaria','admin']}/>
        <div className="col-md-12 col-xs-12 main-div container">
          {this.props.children}
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

export default connect(mapStateToProps, { getUsuario })(App);
