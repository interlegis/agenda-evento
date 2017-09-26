import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import _ from 'lodash';
import { cadastroPedido, getUsuario } from '../actions';
import { SELECT, CHECKBOX, TEXTAREA, DATA_INICIO, DATA_FIM,
  TIME, TELEFONE } from '../actions/types';
import { FIELD_PEDIDO } from './forms/fields_types';
import moment from 'moment';
import DatePicker from 'react-bootstrap-date-picker';
import $ from 'jquery';
import { mask } from 'jquery-mask-plugin';

moment.locale("pt-br");

$('#maskTelForm').find('[name="telefone"]').mask('(099)9999-9999');
$('.form-group').find('[name="hora_inicio"]').mask('99:99:99');
$('.form-group').find('[name="hora_fim"]').mask('99:99:99');

class NovoPedido extends Component{
  constructor(props){
    super(props);

    this.state = {
      value: 'AI'
    };

    this.handleChange = this.handleChange.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
      fields: PropTypes.object.isRequired,
      handleSubmit: PropTypes.func.isRequired,
      resetForm: PropTypes.func.isRequired,
      submitting: PropTypes.bool.isRequired
  };

  componentWillMount() {
    this.props.getUsuario();
  }

  handleSubmitForm(formProps){
    this.props.cadastroPedido(formProps);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  renderAlert(){
    if (this.props.errorMessage === 'Evento fora do período de editar') {
      swal(
          { title: "Cancelado",
          text: "Evento fora do período de editar!",
          type: "error",
          timer: 2000,
          showConfirmButton: false
        }, () => {
          // Redirect the user
          window.location.href = "/#/main";
        }
      );
    }
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
          <fieldset className="form-group"
          key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <select {...fieldHelper} className="form-control"
            value={this.state.value} onChange={this.handleChange}>
              <option disabled>Selecione um local</option>
              <option value={fieldConfig.option.AI}>Auditório Interlegis</option>
              <option value={fieldConfig.option.SR}>Sala de Reuniões</option>
            </select>
          </fieldset>
        );
      break;
      case CHECKBOX:
        return(
          <fieldset className="form-group"
          key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <input name={fieldConfig.name} id={fieldConfig.name}
            className="form-control" {...fieldHelper}
            type={fieldConfig.type} />
          </fieldset>
        );
      break;
      case TEXTAREA:
        return(
          <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
            ? "form-group has-error has-feedback" : "form-group"}
            key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
           <fieldConfig.type
             placeholder={`Insira a ${fieldConfig.label}`}
             cols="10"
             type="text"
             {...fieldHelper}
             className="form-control"
             rows="8"
             value={fieldHelper.value || ''}
           />
           {fieldHelper.touched && fieldHelper.invalid
             && fieldHelper.error &&
             <div className="help-block">{fieldHelper.error}</div>}
           </fieldset>
        );
      break;
      case DATA_INICIO:
        return(
          <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
            ? "form-group has-error has-feedback" : "form-group"}
             key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <DatePicker
              {...fieldHelper}
              dateFormat="DD-MM-YYYY"
              placeholder={`Insira a ${fieldConfig.label}`}
              id="data_inicio"
              name="data_inicio"
              monthLabels={['Janeiro', 'Feveiro', 'Março', 'Abril', 'Maio',
              'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro',
              'Novembro', 'Dezembro']}
              dayLabels={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
            />
            {fieldHelper.touched && fieldHelper.invalid
              && fieldHelper.error &&
              <div className="help-block">{fieldHelper.error}</div>}
          </fieldset>
        );
      break;
      case DATA_FIM:
        return(
          <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
            ? "form-group has-error has-feedback" : "form-group"}
             key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <DatePicker
              {...fieldHelper}
              dateFormat="DD-MM-YYYY"
              placeholder={`Insira a ${fieldConfig.label}`}
              id="data_fim"
              name="data_fim"
              monthLabels={['Janeiro', 'Feveiro', 'Março', 'Abril', 'Maio',
              'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro',
              'Novembro', 'Dezembro']}
              dayLabels={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
            />
            {fieldHelper.touched && fieldHelper.invalid
              && fieldHelper.error &&
              <div className="help-block">{fieldHelper.error}</div>}
          </fieldset>
        );
      break;
      case TIME:
        return(
          <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
            ? "form-group has-error has-feedback" : "form-group"}
             key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <input className="form-control" {...fieldHelper}
            type={fieldConfig.type}
            placeholder={`Coloque ${fieldConfig.label}`}
            onChange={
              (event) => {
                this.props.pedido[field] = event.target.value;
              this.forceUpdate();}
            }
            value={this.props.pedido[field]}/>
            {fieldHelper.touched && fieldHelper.error &&
              <div className="help-block">{fieldHelper.error}</div>}
          </fieldset>
        );
      break;
      case TELEFONE:
        return(
          <fieldset id="maskTelForm" className={(fieldHelper.touched && fieldHelper.invalid)
            ? "form-group has-error has-feedback" : "form-group"}
             key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <input className="form-control" {...fieldHelper}
            type={fieldConfig.type} name="telefone"
            placeholder={`Coloque ${fieldConfig.label}`} />
            {fieldHelper.touched && fieldHelper.error &&
              <div className="help-block">{fieldHelper.error}</div>}
          </fieldset>
        );
      break;
      default:
        return(
          <fieldset className={(fieldHelper.touched && fieldHelper.invalid)
            ? "form-group has-error has-feedback" : "form-group"}
             key={`${fieldConfig.type}\_${fieldConfig.label}`}>
            <label className="control-label">{fieldConfig.titulo}</label>
            <input className="form-control" {...fieldHelper}
            type={fieldConfig.type}
            placeholder={`Coloque ${fieldConfig.label}`}/>
            {fieldHelper.touched && fieldHelper.error &&
              <div className="help-block">{fieldHelper.error}</div>}
          </fieldset>
        );
    }
  }

  render(){
    const { handleSubmit, pristine, resetForm, submitting,
      fields: { nome ,descricao ,local ,data_inicio ,hora_inicio ,
                data_fim ,hora_fim, nome_responsavel ,email_responsavel ,
                telefone_responsavel ,lotacao_responsavel}} = this.props;

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
                (nome_responsavel.touched && nome_responsavel.invalid) ||
                (hora_inicio.touched && hora_inicio.invalid) ||
                (hora_fim.touched && hora_fim.invalid) ||
                (data_inicio.touched && data_inicio.invalid) ||
                (data_fim.touched && data_fim.invalid) ||
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
  var re_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var re_tel = /^\([0-9]{3}\)[0-9]{4,5}-[0-9]{4}$/;
  var re_time = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

  _.each(FIELD_PEDIDO, (fieldConfig, field) => {
    if (!values[field] && fieldConfig.type != 'select' &&
        fieldConfig.type != 'checkbox' && fieldConfig.type != 'observacao'){
      errors[field] = `Por favor, insira ${fieldConfig.label}...`;
    }

    if (values[field] && fieldConfig.type == 'Email' && !re_email.test(values[field])) {
      errors[field] = `Por favor, insira um email em formato valido!`;
    }
    if (values[field] && fieldConfig.type == 'tel' && !re_tel.test(values[field])) {
      errors[field] = `Por favor, insira um telefone em formato valido!`;
    }
    if (values[field] && fieldConfig.type == 'time' && !re_time.test(values[field])) {
      errors[field] = `Por favor, insira um horario em formato valido!`;
    }

  });
  return errors;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.authentication.error
  };
}

export default reduxForm({
  form: 'pedido',
  fields: _.keys(FIELD_PEDIDO),
  validate
}, mapStateToProps, { cadastroPedido, getUsuario })(NovoPedido);
