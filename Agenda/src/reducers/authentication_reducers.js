import { AUTH_USUARIO, UNAUTH_USUARIO, ERROR, RECAPTCHA } from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case AUTH_USUARIO:
      return { ...state, authenticated: true };
    case UNAUTH_USUARIO:
      return { ...state, authenticated: false };
    case ERROR:
      return { ...state, error: action.payload };
    case RECAPTCHA:
      return { ...state, recaptchaResponse: action.payload };
    default:
      return state;
  };
}
