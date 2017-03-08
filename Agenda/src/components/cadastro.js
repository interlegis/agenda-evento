import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import _ from 'lodash';
import * as actions from '../actions';

const FIELDS = {
  primeiro_nome: {
    type:'text',
    titulo:'Primeiro Nome:',
    label:'seu primeiro nome'
  },
  ultimo_nome: {
    type:'text',
    titulo:'Sobrenome:',
    label:'seu sobrenome'
  },
  usuario: {
    type:'text',
    titulo:'Usuario:',
    label:'o nome do usuario'
  },
  email: {
    type:'email',
    titulo:'Email:',
    label:'o email'
  },
  senha: {
    type:'password',
    titulo:'Senha:',
    label:'sua senha'
  },
};

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
      fields: { primeiro_nome ,ultimo_nome ,usuario ,email, senha }} = this.props;

    return(
      <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
        {_.map(FIELDS, this.renderField.bind(this))}
        {this.renderAlert()}
        <div className="btn-group" role="group">
            <button type="submit" disabled={submitting}
              className={((primeiro_nome.touched && primeiro_nome.invalid) ||
                (ultimo_nome.touched && ultimo_nome.invalid) ||
                (usuario.touched && usuario.invalid) ||
                (email.touched && email.invalid) ||
                (senha.touched && senha.invalid)) ?
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

  _.each(FIELDS, (type, field) => {
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
  fields: _.keys(FIELDS),
  validate
}, mapStateToProps, actions)(Cadastro);
