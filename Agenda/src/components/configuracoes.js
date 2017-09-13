import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import _ from 'lodash';
import { getUsuario, updateUsuario, signinUser } from '../actions';
import { FIELD_USUARIO_CADASTRO, FIELD_USUARIO_UPDATE } from './forms/fields_types';

class Configuracoes extends Component{
  constructor(props) {
        super(props);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.getUsuario();
  }

  handleSubmitForm(formProps){
    this.props.updateUsuario(formProps);
    this.props.signinUser(formProps);
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
        <label className="control-label">{fieldConfig.titulo}</label>
        <input className="form-control" {...fieldHelper} type={fieldConfig.type}
        placeholder={`Coloque ${fieldConfig.label}`} />
        {fieldHelper.touched && fieldHelper.error &&
           <div className="help-block">{fieldHelper.error}</div>}
      </fieldset>
    );
  }

  render(){
    if (this.props.user) {
      const { handleSubmit, pristine, resetForm, submitting,
        fields: { first_name ,last_name ,username ,email, password }} = this.props;
      return(
        <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}
          className="div-pedido">
          {_.map(FIELD_USUARIO_CADASTRO, this.renderField.bind(this))}
          {this.renderAlert()}
          <div className="btn-pedido" role="group">
              <button type="submit" disabled={submitting}
                className={((first_name.touched && first_name.invalid) ||
                  (last_name.touched && last_name.invalid) ||
                  (username.touched && username.invalid) ||
                  (email.touched && email.invalid) ||
                  (password.touched && password.invalid)) ?
                   "btn btn-primary btn-md disabled space" : "btn btn-primary btn-md space"}>
                  Atualizar
              </button>
              <button type="button" className="btn btn-default btn-md space"
                disabled={pristine || submitting}
                onClick={resetForm}>
                Limpar
              </button>
              <Link to="/" className="btn btn-danger btn-md space" role="button">
                Cancelar
              </Link>
            </div>
            <div className="space-50"></div>
        </form>
      );
    }

    return (
      <h2 className="title">Carregando...</h2>
    );
  }
}

function validate(values) {
  const errors = {};
  var re_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  _.each(FIELD_USUARIO_CADASTRO, (fieldConfig, field) => {
    if (!values[field]) {
      errors[field] = `Por favor, insira ${fieldConfig.label}...`;
    }

    if (values[field] && fieldConfig.type == 'email' && !re_email.test(values[field])) {
      errors[field] = `Por favor, insira um email em formato valido!`;
    }
  });
  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.authentication.error,
           user: state.user.usuario,
           initialValues: state.user.usuario };
}

export default reduxForm({
  form: 'configuracoes',
  fields: _.keys(FIELD_USUARIO_CADASTRO),
  validate
}, mapStateToProps, { getUsuario, updateUsuario, signinUser })(Configuracoes);
