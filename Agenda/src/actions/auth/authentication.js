import axios from 'axios';
import { browserHistory } from 'react-router';
import { AUTH_USUARIO, UNAUTH_USUARIO, USUARIO, CREATE_USUARIO, ROOT_URL, UPDATE_USUARIO }
from '../types';
import { ErrorMessage } from '../error/error';
import Cookies from 'js-cookie';

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
        dispatch(ErrorMessage(''));
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
            dispatch({ type: USUARIO, payload: response.data});
            if (response.data.groups.length > 0) {
              var array_roles = [];
              for (var i = 0; i < response.data.groups.length; i++) {
                array_roles.push(response.data.groups[i].name);
              }
              Cookies.set('roles',array_roles);
            }
            dispatch(ErrorMessage(''));
          })
          .catch(() => {
              dispatch(signoutUser());
              dispatch(ErrorMessage('Usuario não esta autenticado'));
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
            dispatch(ErrorMessage(''));
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
                dispatch(ErrorMessage(''));
                dispatch({ type: USUARIO, payload: response.data})
              })
              .catch(() => {
                  dispatch(signoutUser());
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

export function signoutUser(){
  localStorage.removeItem('token');
  Cookies.remove('roles');
  return{ type: UNAUTH_USUARIO };
}

export function getUsuario(){
  return function(dispatch){
    const config_user = {
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/json',
          'Authorization': 'token ' + localStorage.token
      }
    };

    axios.get(`${ROOT_URL}api/users/i/`, config_user)
      .then(response => {
        dispatch(ErrorMessage(''));
        dispatch({ type: USUARIO, payload: response.data});
      })
      .catch(() => {
          dispatch(signoutUser());
          dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}

export function updateUsuario({ first_name ,last_name ,username ,email, password }){
  return function(dispatch){
    const config_user = {
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/json',
          'Authorization': 'token ' + localStorage.token
      }
    };

    axios.put(`${ROOT_URL}api/users/i/`,
      { first_name ,last_name ,username ,email, password } ,config_user)
      .then(response => {
        dispatch({ type: UPDATE_USUARIO, payload: response.data});
        dispatch(ErrorMessage(''));
        swal(
            { title: "Sucesso!",
            text: "Usuario Atualizado.",
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
          dispatch(signoutUser());
          dispatch(ErrorMessage('Erro Interno - Usuario nao Encontrado, erro no servidor'));
          swal({
            title: "Oops...",
            text: "Usuario Indisponivel. Try Again Later ¯\\_(ツ)_/¯",
            type: "error",
            animation: "slide-from-top",
            timer: 2000,
            showConfirmButton: false
          }, () => {
          // Redirect the user
          window.location.href = "/main";
          });
          throw err;
      });
  }
}
