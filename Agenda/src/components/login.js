import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import * as actions from '../actions';

const FIELDS = {
  usuario: {
    type:'text',
    titulo:'Usuario:',
    label:'o nome do usuario'
  },
  senha: {
    type:'password',
    titulo:'Senha:',
    label:'sua senha'
  }
};

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
       fields: { usuario, senha }} = this.props;
    return(
      <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
        {_.map(FIELDS, this.renderField.bind(this))}
        {this.renderAlert()}
        <button type="submit" disabled={submitting}
          className={((usuario.touched && usuario.invalid) ||
            (senha.touched && senha.invalid)) ?
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

  _.each(FIELDS, (type, field) => {
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
  fields: _.keys(FIELDS),
  validate
}, mapStateToProps, actions)(Login);
