import React, { Component } from 'react';
import Navbar from './navbar';

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar/>
        <div className="col-md-12 main-div">
          {this.props.children}
        </div>
      </div>
    );
  }
}
