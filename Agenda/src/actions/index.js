import axios from 'axios';
import { browserHistory } from 'react-router';
import { AUTH_USUARIO, UNAUTH_USUARIO, ERROR, USUARIO, CREATE_USUARIO } from './types';
import Cookies from 'js-cookie'

const ROOT_URL = 'http://127.0.0.1:8000/';

const config = {
  headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'Content-Type': 'application/json'
  }
};

export function signinUser({ username, password }) {
  return function(dispatch){
    axios.post(`${ROOT_URL}api/auth/`, { username, password }, config)
      .then(response => {
        dispatch({ type: AUTH_USUARIO });
        localStorage.setItem('token', response.data.token);
        const config_user = {
          headers: {
              'X-CSRFToken': Cookies.get('csrftoken'),
              'Content-Type': 'application/json',
              'Authorization': 'token ' + response.data.token
          }
        };
        axios.get(`${ROOT_URL}api/users/i/`, config_user)
          .then(response => {
            dispatch({ type: USUARIO, payload: response.data})
          })
          .catch(() => {
              dispatch(signoutUser())
              dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
          })
        browserHistory.push('/main');
      })
      .catch(() => {
        dispatch(ErrorMessage('Usuario ou senha Invalidos'));
      });
  }
}

export function cadastroUsuario({ first_name ,last_name ,username ,email, password }) {
  return function(dispatch){
    axios.post(`${ROOT_URL}api/users/`, { first_name ,last_name ,username ,email, password })
      .then(response => {
        axios.post(`${ROOT_URL}api/auth/`, { username, password }, config)
          .then(response => {
            dispatch({ type: AUTH_USUARIO });
            localStorage.setItem('token', response.data.token);
            const config_user = {
              headers: {
                  'X-CSRFToken': Cookies.get('csrftoken'),
                  'Content-Type': 'application/json',
                  'Authorization': 'token ' + response.data.token
              }
            };
            axios.get(`${ROOT_URL}api/users/i/`, config_user)
              .then(response => {
                dispatch({ type: USUARIO, payload: response.data})
              })
              .catch(() => {
                  dispatch(signoutUser())
                  dispatch(ErrorMessage('Erro Interno - Usuario Criado, erro no servidor'));
              })
            browserHistory.push('/main');
          })
      })
      .catch(() => {
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
    }
}

export function ErrorMessage(error) {
  return{
    type: ERROR,
    payload: error
  }
}

export function signoutUser(){
  localStorage.removeItem('token');
  return{ type: UNAUTH_USUARIO };
}
