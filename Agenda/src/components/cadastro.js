import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../actions';

class Cadastro extends Component{
  handleSubmitForm(formProps){
    console.log(formProps);
    this.props.cadastroUsuario(formProps);
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
    const { handleSubmit, fields: { first_name ,last_name ,username ,email, password }} = this.props;

    return(
      <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
        <fieldset className="form-group">
          <label>Primeiro Nome:</label>
          <input className="form-control" {...first_name} type="text"/>
          {first_name.touched && first_name.error && <div className="error">{first_name.error}</div>}
        </fieldset>
        <fieldset className="form-group">
          <label>Sobrenome:</label>
          <input className="form-control" {...last_name} type="text"/>
          {last_name.touched && last_name.error && <div className="error">{last_name.error}</div>}
        </fieldset>
        <fieldset className="form-group">
          <label>Usuario:</label>
          <input className="form-control" {...username} type="text"/>
          {username.touched && username.error && <div className="error">{username.error}</div>}
        </fieldset>
        <fieldset className="form-group">
          <label>Email:</label>
          <input className="form-control" {...email} type="email"/>
          {email.touched && email.error && <div className="error">{email.error}</div>}
        </fieldset>
        <fieldset className="form-group">
          <label>Senha:</label>
          <input className="form-control" {...password} type="password"/>
          {password.touched && password.error && <div className="error">{password.error}</div>}
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary" onClick={() => console.log('oi')}>Cadastre-se</button>
      </form>
    );
  }
}

function validate(formProps){
  const errors = {};
  if (!formProps.first_name) {
    errors.first_name = 'Por favor, insira seu primeiro nome';
  }

  if (!formProps.last_name) {
    errors.last_name = 'Por favor, insira seu sobrenome';
  }

  if (!formProps.username) {
    errors.username = 'Por favor, insira o nome de usuario';
  }

  if (!formProps.email) {
    errors.email = 'Por favor, insira o email';
  }

  if (!formProps.password) {
    errors.password = 'Por favor, insira sua senha';
  }
  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.authentication.error};
}

export default reduxForm({
  form: 'cadastro',
  fields: [ 'first_name','last_name', 'email','username', 'password' ],
  validate
}, mapStateToProps, actions)(Cadastro);
