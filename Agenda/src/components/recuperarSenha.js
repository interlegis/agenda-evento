import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import { atualizarSenha } from '../actions';
import { FIELD_RECUPERAR_SENHA } from './forms/fields_types';

class RecuperarSenha extends Component{
  handleSubmitForm({ password}){
    const token = this.props.params.token;
    this.props.atualizarSenha({password, token});
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
      <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
        ? "form-group has-error has-feedback" : "form-group"}
        key={`${fieldConfig.type}\_${fieldConfig.label}`}>
        <label className="control-label center">{fieldConfig.titulo}</label>
        <input className="form-control" {...fieldHelper} type={fieldConfig.type}
        placeholder={`Coloque ${fieldConfig.label}`}/>
        {fieldHelper.touched && fieldHelper.error &&
          <div className="help-block">{fieldHelper.error}</div>}
      </fieldset>
    );
  }

  render(){
    const { error, handleSubmit, pristine, resetForm, submitting,
       fields: { password}} = this.props;
    return(
      <div>
      <div>
        <h2 className="title">Agenda de Eventos Interlegis</h2>
        <h3>Sistema para agendamento de eventos a serem realizados no prédio Interlegis</h3>
      </div>
      <div className="center-div-flex">
        <div className="panel panel-primary col-md-5 center">
          <div className="panel-heading text-center">Recuperar minha Senha</div>
              <div className="panel-body center col-md-12">
                <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}
                  className="center col-md-12" style={{paddingBottom: 10}}>
                  {_.map(FIELD_RECUPERAR_SENHA, this.renderField.bind(this))}
                  {this.renderAlert()}
                <div className="login-button">
                  <button type="submit" disabled={submitting}
                      className={(password.touched && password.invalid)?
                         "btn btn-primary btn-md disabled" : "btn btn-primary btn-md"}>
                        Confirmar
                  </button>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(FIELD_RECUPERAR_SENHA, (type, field) => {
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
  fields: _.keys(FIELD_RECUPERAR_SENHA),
  validate
}, mapStateToProps, { atualizarSenha })(RecuperarSenha);
