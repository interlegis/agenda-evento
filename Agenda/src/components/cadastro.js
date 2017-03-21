import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import _ from 'lodash';
import * as actions from '../actions';
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

  renderField(fieldConfig, field){
    const fieldHelper = this.props.fields[field];

    return(
      <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
        ? "form-group has-error has-feedback" : "form-group"} key={`${fieldConfig.type}\_${fieldConfig.label}`}>
        <label className="control-label">{fieldConfig.titulo}</label>
        <input className="form-control" {...fieldHelper} type={fieldConfig.type}
        placeholder={`Coloque ${fieldConfig.label}`} />
        {fieldHelper.touched && fieldHelper.error &&
           <div className="help-block">{fieldHelper.error}</div>}
      </fieldset>
    );
  }

  render(){
    const { error, handleSubmit, pristine, resetForm, submitting,
      fields: { first_name ,last_name ,username ,email, password }} = this.props;

    return(
      <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
        {_.map(FIELD_USUARIO_CADASTRO, this.renderField.bind(this))}
        {this.renderAlert()}
        <div className="btn-group" role="group">
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
          <Link to="/" className="btn btn-danger btn-md" role="button">
            Cancelar
          </Link>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(FIELD_USUARIO_CADASTRO, (type, field) => {
    if (!values[field]) {
      errors[field] = `Por favor, insira ${type.label}...`;
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
}, mapStateToProps, actions)(Cadastro);
