import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import * as actions from '../actions';
import { FIELD_USUARIO_LOGIN } from './forms/fields_types';

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

  renderField(fieldConfig, field){
    const fieldHelper = this.props.fields[field];

    return(
      <fieldset className="form-group" key={`${fieldConfig.type}\_${fieldConfig.label}`}>
        <label>{fieldConfig.titulo}</label>
        <input className="form-control" {...fieldHelper} type={fieldConfig.type}
        placeholder={`Coloque ${fieldConfig.label}`}/>
        {fieldHelper.touched && fieldHelper.error && <div className="error">{fieldHelper.error}</div>}
      </fieldset>
    );
  }

  render(){
    const { error, handleSubmit, pristine, resetForm, submitting,
       fields: { username, password }} = this.props;
    return(
      <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
        {_.map(FIELD_USUARIO_LOGIN, this.renderField.bind(this))}
        {this.renderAlert()}
        <button type="submit" disabled={submitting}
          className={((username.touched && username.invalid) ||
            (password.touched && password.invalid)) ?
             "btn btn-primary btn-md disabled" : "btn btn-primary btn-md"}>
            Entrar
        </button>
        <button type="button" className="btn btn-default btn-md"
          disabled={pristine || submitting} onClick={resetForm}>
          Limpar
        </button>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(FIELD_USUARIO_LOGIN, (type, field) => {
    if (!values[field]) {
      errors[field] = `Por favor, insira ${type.label}...`;
    }
  });
  return errors;
}

function mapStateToProps(state){
  return { errorMessage: state.authentication.error };
}

export default reduxForm({
  form: 'login',
  fields: _.keys(FIELD_USUARIO_LOGIN),
  validate
}, mapStateToProps, actions)(Login);
