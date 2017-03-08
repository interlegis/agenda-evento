import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../actions';

class Login extends Component{
  handleSubmitForm({ username, password }){
    this.props.signinUser({username, password});
  }

  renderAlert(){
    if (this.props.errorMessage) {
      return(
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render(){
    const { handleSubmit, fields: { username, password }} = this.props;
    return(
      <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
        <fieldset className="form-group" >
          <label>Usuario:</label>
          <input {...username} className="form-control" type="text"/>
        </fieldset>
        <fieldset className="form-group" >
          <label>Senha:</label>
          <input {...password} className="form-control" type="password"/>
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Entrar</button>
      </form>
    );
  }
}

function mapStateToProps(state){
  return { errorMessage: state.authentication.error };
}

export default reduxForm({
  form: 'login',
  fields: ['username','password']
}, mapStateToProps, actions)(Login);
