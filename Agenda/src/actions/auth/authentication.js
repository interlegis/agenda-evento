import axios from 'axios';
import { AUTH_USUARIO, UNAUTH_USUARIO, USUARIO, ROOT_URL, UPDATE_USUARIO,
  ROOT_URL_AGENDA, ROLES, RECAPTCHA, URL_CAPTCHA }
from '../types';
import { ErrorMessage } from '../error/error';
import Cookies from 'js-cookie';
import swal from 'sweetalert';

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
              dispatch({ type: ROLES, payload: array_roles});
            }
            dispatch(ErrorMessage(''));
          })
          .catch(() => {
              dispatch(signoutUser());
              dispatch(ErrorMessage('Usuario não esta autenticado'));
          })
          window.location.href = '/#/main';
      })
      .catch(() => {
        dispatch(
          ErrorMessage(
            'Usuario ou senha Invalidos. Veja seu email se o usuario acabou de ser criado.'
          ));
      });
  }
}

export function cadastroUsuario({ first_name ,last_name ,username ,email, password }) {
  return function(dispatch){
    axios.post(`${ROOT_URL}api/users/`,
      { ROOT_URL_AGENDA, first_name ,last_name ,username ,email, password })
      .then(response => {
        dispatch(ErrorMessage(''));
        swal(
            { title: "Sucesso!",
            text: "Usuario Criado. Verifique seu email para ser autenticado",
            type: "success",
            timer: 2000,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: "#001B5B",
          }, () => {
          // Redirect the user
          window.location.href = '/#/login';
          }
        );
      })
      .catch((err) => {
        if ((err.response.data.username !== undefined) &&
          (err.response.data.email !== undefined)){
              dispatch(ErrorMessage('Usuario e email já estão sendo usados.'));
          } else if (err.response.data.email !== undefined) {
            dispatch(ErrorMessage(`${err.response.data.email[0]}`));
        } else if (err.response.data.username !== undefined) {
            dispatch(ErrorMessage(`${err.response.data.username[0]}`));
        } else {
            dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
        }
      });
    }
}

export function signoutUser(){
  return function(dispatch){
    localStorage.removeItem('token');
    Cookies.remove('roles');
    var array_roles = [];
    dispatch({ type: ROLES, payload: array_roles});
    dispatch({ type: UNAUTH_USUARIO });
  }
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
        if (response.data.groups.length > 0) {
          var array_roles = [];
          for (var i = 0; i < response.data.groups.length; i++) {
            array_roles.push(response.data.groups[i].name);
          }
          Cookies.set('roles', array_roles);
          dispatch({ type: ROLES, payload: array_roles});
        }
        dispatch({ type: USUARIO, payload: response.data});
      })
      .catch(() => {
          dispatch(signoutUser());
          dispatch(ErrorMessage('Usuario não autenticado. Tente novamente.'));
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
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: "#001B5B",
          }, () => {
          // Redirect the user
          window.location.href = '/#/main';
          }
        );
      })
      .catch((err) => {
          dispatch(signoutUser());
          dispatch(ErrorMessage('Erro Interno - Usuario nao Encontrado, erro no servidor'));
          swal({
            title: "Oops...",
            text: "Usuario Indisponivel. ",
            type: "error",
            animation: "slide-from-top",
            timer: 2000,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: "#001B5B",
          }, () => {
          // Redirect the user
          window.location.href = '/#/main';
          });
          throw err;
      });
  }
}

export function recuperarSenha({ email }){
  return function(dispatch){
  const config = {
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json'
    }
  };
  axios.post(`${ROOT_URL}api/users/recuperaSenha/`,{ email, ROOT_URL_AGENDA }, config)
    .then(response => {
      dispatch(ErrorMessage(''));
      swal({
        title: "Recuperar Senha",
        text: "Uma nova senha foi enviada para o seu email.",
        type: "success",
        animation: "slide-from-top",
        timer: 2000,
      }, () => {
      // Redirect the user
      window.location.href = '/#/login';
      });
    })
    .catch(() => {
        dispatch(signoutUser());
        dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
    });
  }
}

export function atualizarSenha({password, token}){
  return function(dispatch){
    const config = {
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/json'
      }
    };
    axios.post(`${ROOT_URL}api/users/i/atualizarSenha/`,{password, token}, config)
      .then(response => {
        dispatch(ErrorMessage(''));
        swal({
          title: "Senha Atualizada com sucesso",
          text: "Realize o login com a nova senha.",
          type: "success",
          animation: "slide-from-top",
          timer: 2000,
        }, () => {
        // Redirect the user
        window.location.href = '/#/login';
        });
      })
      .catch(() => {
          dispatch(signoutUser());
          dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}

export function cadastroAutenticado({ token }){
  return function(dispatch){
    const config = {
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/json'
      }
    };
    axios.post(`${ROOT_URL}api/users/i/autenticaCadastro/`,{ token }, config)
      .then(response => {
        dispatch(ErrorMessage(''));
        swal({
          title: "Usuario Autenticado com sucesso",
          text: "Realize o seu login.",
          type: "success",
          animation: "slide-from-top",
          timer: 2000,
        }, () => {
        // Redirect the user
        window.location.href = '/#/login';
        });
      })
      .catch(() => {
          dispatch(signoutUser());
          dispatch(ErrorMessage('Erro Interno - Tente novamente mais tarde'));
      });
  }
}

export function getRecaptchaResponse(token){
  return function(dispatch){
    const secret = '6LfxDykUAAAAAA49n25MQCnb64xYNTf7oSJ79XMe';

    const config_user = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Content-Range, X-Content-Range, Content-Disposition, Content-Description',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
          'Access-Control-Max-Age': '86400'
      }
    };

    axios.get(`http://cors-anywhere.herokuapp.com/${URL_CAPTCHA}?secret=${secret}&response=${token}`, {config_user,
  	proxy: {
  	  host: '66.70.191.215',
  	  port: 1080
  	}})
      .then((response) => {
        dispatch({ type: RECAPTCHA, payload: response.data });
        dispatch(ErrorMessage(''));
      })
      .catch((err) => {
        dispatch(ErrorMessage('Erro Interno - No Access-Control-Allow-Origin provided'));
      });
  }
}
