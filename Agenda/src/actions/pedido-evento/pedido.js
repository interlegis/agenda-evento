import axios from 'axios';
import { CRIA_PEDIDO, GET_PEDIDOS_USER,
        ROOT_URL, RESERVA_GET, EVENTO_GET,
        SAVE_CALENDAR, SAVE_CALENDAR_NEWS, AVISO_ALERT } from '../types';
import { ErrorMessage } from '../error/error';
import Cookies from 'js-cookie';
import _ from 'lodash';

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function DataFormat(data_string) {
  const d = new Date(data_string);
  const dia = addZero(d.getUTCDate());
  const mes = addZero(d.getUTCMonth() + 1);
  const ano = addZero(d.getFullYear());
  return (ano + '-' + mes + '-' + dia);
}

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
          "data_inicio": DataFormat(props.data_inicio),
          "hora_inicio": props.hora_inicio,
          "data_fim": DataFormat(props.data_fim),
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
            {
            title: "Pedido Criado com Sucessco",
            text: "Aguarde Confirmação",
            type: "success",
            animation: "slide-from-top",
            timer: 4000,
            showConfirmButton: false
          }, () => {
            // Redirect the user
            window.location.href = "/main";
          }
        );
      })
      .catch((err) => {
        console.log(err.response.data.non_field_errors);
        dispatch(ErrorMessage(`${err.response.data.non_field_errors}`));
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

export function getAgendaPedidosNews(){
  const config_user = {
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
    }
  };
  return function(dispatch){
    axios.get(`${ROOT_URL}api/eventos/agenda/news`, config_user)
      .then(response => {
        dispatch({ type: SAVE_CALENDAR_NEWS, payload: response.data });
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
        dispatch(ErrorMessage('Usuario não autenticado.'));
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
        dispatch(ErrorMessage(''));
      })
      .catch(() => {
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}

export function updatePedido(props, id){
  return function(dispatch){
    const config_user = {
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/json',
          'Authorization': 'token ' + localStorage.token
      }
    };

    const data = {
      "nome": props.nome,
      "descricao": props.descricao,
      "local": props.local,
      "data_inicio": DataFormat(props.data_inicio),
      "hora_inicio": props.hora_inicio,
      "data_fim": DataFormat(props.data_fim),
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
    axios.put(`${ROOT_URL}api/pedido/${id}/evento/`,
      data ,config_user)
      .then(response => {
        dispatch({ type: EVENTO_GET, payload: response.data});
        dispatch(ErrorMessage(''));
        swal(
            { title: "Sucesso!",
            text: "Pedido Atualizado.",
            imageUrl: "http://www.clker.com/cliparts/7/0/5/4/1436615856967074484thumbs-up.jpg",
            timer: 2000,
            showConfirmButton: false
          }, () => {
            // Redirect the user
            window.location.href = "/main";
          }
        );
      })
      .catch((err) => {
          console.log(err.response.data.non_field_errors[0]);
          dispatch(ErrorMessage(`${err.response.data.non_field_errors[0]}`));
      });
  }
}
