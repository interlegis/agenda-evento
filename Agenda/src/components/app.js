import React, { Component } from 'react';
import Navbar from './navbar';

export default class App extends Component {
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
