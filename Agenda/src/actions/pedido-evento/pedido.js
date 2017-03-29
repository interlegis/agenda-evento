import axios from 'axios';
import { CRIA_PEDIDO, GET_PEDIDOS_USER,
        ROOT_URL, RESERVA_GET, EVENTO_GET,
        SAVE_CALENDAR, AVISO_ALERT } from '../types';
import { ErrorMessage } from '../error/error';
import Cookies from 'js-cookie';
import _ from 'lodash';

export function cadastroPedido(props) {
  const config_user = {
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        'Authorization': 'token ' + localStorage.token
    }
  };
  return function(dispatch){
    const data = {
      "evento": {
          "nome": props.nome,
          "descricao": props.descricao,
          "local": props.local,
          "data_inicio": props.data_inicio,
          "hora_inicio": props.hora_inicio,
          "data_fim": props.data_fim,
          "hora_fim": props.hora_fim,
          "legislativo": props.legislativo,
          "observacao": props.observacao,
          "video_conferencia": props.video_conferencia,
          "responsavel": {
              "nome": props.nome_responsavel,
              "email": props.email_responsavel,
              "telefone": props.telefone_responsavel,
              "lotacao": props.lotacao_responsavel
          }
      }
    }
    axios.post(`${ROOT_URL}api/pedido/`, data, config_user)
      .then(response => {
        dispatch({ type: CRIA_PEDIDO });
        dispatch(ErrorMessage(''));
        swal(
            { title: "Pedido Criado com Sucessco",
            text: "Aguarde Confirmação",
            animation: "slide-from-top",
            timer: 2000,
            showConfirmButton: false
          }
        );
      })
      .catch((err) => {
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
        swal({
          title: "Oops...",
          text: "Erro Interno - Tente novamente mais tarde",
          type: "error",
          animation: "slide-from-top",
          timer: 2000,
          showConfirmButton: false
        }, () => {
        // Redirect the user
        window.location.href = "/";
        });
        throw err;
      });
  }
}

export function getPedidos(){
  const config_user = {
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        'Authorization': 'token ' + localStorage.token
    }
  };
  return function(dispatch){
    axios.get(`${ROOT_URL}api/pedido/user`, config_user)
      .then(response => {
        dispatch({ type: GET_PEDIDOS_USER, payload: response.data });
        dispatch(ErrorMessage(''));
      })
      .catch(() => {
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}

export function getAgendaPedidos(){
  const config_user = {
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
    }
  };
  return function(dispatch){
    axios.get(`${ROOT_URL}api/eventos/agenda`, config_user)
      .then(response => {
        dispatch({ type: SAVE_CALENDAR, payload: response.data });
        dispatch(ErrorMessage(''));
      })
      .catch(() => {
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}

export function getPedidoEvento(id){
  const config_user = {
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        'Authorization': 'token ' + localStorage.token
    }
  };
  return function(dispatch){
    axios.get(`${ROOT_URL}api/pedido/${id}/`, config_user)
      .then(response => {
        dispatch({ type: RESERVA_GET, payload: response.data});
        dispatch(ErrorMessage(''));
        axios.get(`${ROOT_URL}api/pedido/${id}/evento/`, config_user)
          .then(response => {
            dispatch({ type: EVENTO_GET, payload: response.data});
            dispatch(ErrorMessage(''));
          })
          .catch(() => {
            dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
          });
      })
      .catch(() => {
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}

export function deletarPedido(id) {
  const config_user = {
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        'Authorization': 'token ' + localStorage.token
    }
  };
  return function(dispatch){
    axios.delete(`${ROOT_URL}api/pedido/${id}/`, config_user)
      .then(response => {
        dispatch(getPedidos());
      })
      .catch(() => {
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}
