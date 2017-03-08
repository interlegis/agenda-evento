import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signoutUser } from '../actions';
import { browserHistory } from 'react-router';

class Main extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  logout(){
    this.props.signoutUser();
    this.context.router.push('/');
  }

  render() {
    console.log(this.props.user);
    if (this.props.user) {
      return (
        <div>
          <h2>Ola</h2>
          <h3>Username: {this.props.user.username}</h3>
          <h3>Primeiro Nome: {this.props.user.first_name}</h3>
          <h3>Sobrenome: {this.props.user.last_name }</h3>
          <h3>Email: {this.props.user.email}</h3>
          <button className="btn btn-danger" onClick={this.logout.bind(this)} >Log Out</button>
        </div>
      );
    }
    return (
      <div>
        <h2>Ola</h2>
        <button className="btn btn-danger" onClick={this.logout.bind(this)} >Log Out</button>
      </div>
    );
  }

}

function mapStateToProps(state){
  return { user: state.user.usuario };
}

export default connect(mapStateToProps, { signoutUser })(Main);
