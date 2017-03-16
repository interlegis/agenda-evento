import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signoutUser, getUsuario } from '../actions';
import { browserHistory } from 'react-router';

class Main extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    this.props.getUsuario();
  }

  logout(){
    this.props.signoutUser();
    this.context.router.push('/');
  }

  render() {
    const { user } = this.props;
    console.log(user);
    if (user) {
      return (
        <div>
          <h2>Ola</h2>
          <h3>Username: {user.username}</h3>
          <h3>Primeiro Nome: {user.first_name}</h3>
          <h3>Sobrenome: {user.last_name }</h3>
          <h3>Email: {user.email}</h3>
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

export default connect(mapStateToProps, { signoutUser, getUsuario })(Main);
