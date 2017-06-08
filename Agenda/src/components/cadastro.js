import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import _ from 'lodash';
import { cadastroUsuario } from '../actions';
import { FIELD_USUARIO_CADASTRO } from './forms/fields_types';

class Cadastro extends Component{
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
      fields: PropTypes.object.isRequired,
      handleSubmit: PropTypes.func.isRequired,
      resetForm: PropTypes.func.isRequired,
      submitting: PropTypes.bool.isRequired
  };

  handleSubmitForm(formProps){
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

  renderField(fieldConfig, field){
    const fieldHelper = this.props.fields[field];

    return(
      <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
        ? "form-group has-error has-feedback" : "form-group"} key={`${fieldConfig.type}\_${fieldConfig.label}`}>
        <label className="control-label center-div-flex">{fieldConfig.titulo}</label>
        <input className="form-control" {...fieldHelper} type={fieldConfig.type}
        placeholder={`Por favor, insira ${fieldConfig.label}`} />
        {fieldHelper.touched && fieldHelper.error &&
           <div className="help-block">{fieldHelper.error}</div>}
      </fieldset>
    );
  }

  render(){
    const { error, handleSubmit, pristine, resetForm, submitting,
      fields: { first_name ,last_name ,username ,email, password }} = this.props;

    return(
      <div>
        <div>
          <h2 className="title">Agenda de Eventos Interlegis</h2>
          <h3>Sistema para agendamento de eventos a serem realizados no prédio Interlegis</h3>
        </div>
        <div className="center-div-flex col-md-12">
        <div className="panel panel-primary col-md-5">
          <div className="panel-heading text-center">Cadastro</div>
          <div className="panel-body center col-md-12">
            <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}
              className="center col-md-12">
              {_.map(FIELD_USUARIO_CADASTRO, this.renderField.bind(this))}
              {this.renderAlert()}
              <div className="btn-group center-div-flex" role="group">
                  <button type="submit" disabled={submitting}
                    className={((first_name.touched && first_name.invalid) ||
                      (last_name.touched && last_name.invalid) ||
                      (username.touched && username.invalid) ||
                      (email.touched && email.invalid) ||
                      (password.touched && password.invalid)) ?
                       "btn btn-primary btn-md disabled" : "btn btn-primary btn-md"}>
                      Cadastre-se
                  </button>
                  <button type="button" className="btn btn-default btn-md"
                    disabled={pristine || submitting} onClick={resetForm}>
                    Limpar
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
  var re_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  _.each(FIELD_USUARIO_CADASTRO, (fieldConfig, field) => {
    if (!values[field]) {
      errors[field] = `Por favor, insira ${fieldConfig.label}.`;
    }

    if (values[field] && fieldConfig.type == 'email' && !re_email.test(values[field])) {
      errors[field] = `Por favor, insira um email em formato valido!`;
    }
  });
  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.authentication.error};
}

export default reduxForm({
  form: 'cadastro',
  fields: _.keys(FIELD_USUARIO_CADASTRO),
  validate
}, mapStateToProps, { cadastroUsuario })(Cadastro);
