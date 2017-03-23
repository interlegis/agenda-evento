import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import _ from 'lodash';
import * as actions from '../actions';
import { SELECT, CHECKBOX } from '../actions/types';
import { FIELD_PEDIDO } from './forms/fields_types';

class NovoPedido extends Component{
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
    this.props.cadastroPedido(formProps);
    this.context.router.push('/main');
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
    switch (fieldConfig.type) {
      case SELECT:
        return(
          <fieldset className="form-group" key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label>{fieldConfig.titulo}</label>
            <select {...fieldHelper} className="form-control" value="">
              <option value={fieldConfig.option.SR}>Sala de Reuniões</option>
              <option value={fieldConfig.option.AI}>Auditório Interlegis</option>
            </select>
            {fieldHelper.error && <div className="error">{fieldHelper.error}</div>}
          </fieldset>
        );
      break;
      case CHECKBOX:
        return(
          <fieldset className="form-group" key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label>{fieldConfig.titulo}</label>
            <input name={fieldConfig.name} id={fieldConfig.name}
            className="form-control" {...fieldHelper} type={fieldConfig.type} />
          </fieldset>
        );
      break;
      default:
        return(
          <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
            ? "form-group has-error has-feedback" : "form-group"}
             key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <input className="form-control" {...fieldHelper} type={fieldConfig.type}
            placeholder={`Coloque ${fieldConfig.label}`}/>
            {fieldHelper.touched && fieldHelper.error &&
              <div className="help-block">{fieldHelper.error}</div>}
          </fieldset>
        );
    }
  }

  render(){
    const { error, handleSubmit, pristine, resetForm, submitting,
      fields: { nome ,descricao ,local ,option ,data_inicio ,hora_inicio ,
                data_fim ,hora_fim ,legislativo ,observacao ,video_conferencia
                ,nome_responsavel ,email_responsavel ,telefone_responsavel
                ,lotacao_responsavel}} = this.props;

    return(
      <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}
        className="div-pedido">
        {_.map(FIELD_PEDIDO, this.renderField.bind(this))}
        {this.renderAlert()}
        <div className="btn-pedido" role="group" aling>
            <button
              type="submit"
              disabled={submitting}
              className={((nome.touched && nome.invalid) ||
                (descricao.touched && descricao.invalid) ||
                (local.touched && local.invalid) ||
                (data_inicio.touched && data_inicio.invalid) ||
                (hora_inicio.touched && hora_inicio.invalid) ||
                (data_fim.touched && data_fim.invalid) ||
                (hora_fim.touched && hora_fim.invalid) ||
                (nome_responsavel.touched && nome_responsavel.invalid) ||
                (email_responsavel.touched && email_responsavel.invalid) ||
                (telefone_responsavel.touched && telefone_responsavel.invalid) ||
                (lotacao_responsavel.touched && lotacao_responsavel.invalid)) ?
                "btn btn-primary btn-md space disabled" :"btn btn-primary btn-md space"}>
              Enviar Pedido
            </button>
            <button type="button" className="btn btn-default btn-md space"
              disabled={pristine || submitting} onClick={resetForm}>
              Limpar
            </button>
            <Link to="/" className="btn btn-danger btn-md space" role="button">
              Cancelar
            </Link>
          </div>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(FIELD_PEDIDO, (fieldConfig, field) => {
    if (!values[field] && fieldConfig.type != 'select' &&
        fieldConfig.type != 'checkbox' && fieldConfig.type != 'observacao'){
      errors[field] = `Por favor, insira ${fieldConfig.label}...`;
    }
  });
  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.authentication.error,
  };
}

export default reduxForm({
  form: 'pedido',
  fields: _.keys(FIELD_PEDIDO),
  validate
}, mapStateToProps, actions)(NovoPedido);
