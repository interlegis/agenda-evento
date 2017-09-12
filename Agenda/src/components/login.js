import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import { signinUser, ErrorMessage } from '../actions';
import { Link } from 'react-router';
import { FIELD_USUARIO_LOGIN } from './forms/fields_types';

class Login extends Component{
  constructor(props) {
        super(props);
        this.props.ErrorMessage('');
  }

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
      <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
        ? "form-group has-error has-feedback" : "form-group"}
        key={`${fieldConfig.type}\_${fieldConfig.label}`}>
        <label className="control-label center">{fieldConfig.titulo}</label>
        <input className="form-control" {...fieldHelper} type={fieldConfig.type}
        placeholder={`Por favor, insira ${fieldConfig.label}`}/>
        {fieldHelper.touched && fieldHelper.error &&
          <div className="help-block">{fieldHelper.error}</div>}
      </fieldset>
    );
  }

  render(){
    const { handleSubmit, pristine, resetForm, submitting,
       fields: { username, password }} = this.props;
    return(
      <div>
      <div>
        <h2 className="title">Agenda de Eventos Interlegis</h2>
        <h3>Sistema para agendamento de eventos a serem realizados no prédio Interlegis</h3>
      </div>
      <div className="center-div-flex">
        <div className="panel panel-primary col-md-5 center">
          <div className="panel-heading text-center">Login</div>
              <div className="panel-body center col-md-12">
                <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}
                  className="center col-md-12" style={{paddingBottom: 10}}>
                  {_.map(FIELD_USUARIO_LOGIN, this.renderField.bind(this))}
                  {this.renderAlert()}
                <div className="login-button">
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
                </div>
                <Link to="/esquecisenha" className="center">Esqueci Senha</Link>
              </form>
              <p className="center" style={{color: 'grey'}}>Ainda não possui cadastro?</p>
              <Link to="/cadastro" className="btn btn-primary btn-sm center">Cadastre-se</Link>
            </div>
        </div>
      </div>
    </div>
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
}, mapStateToProps, { signinUser, ErrorMessage })(Login);
