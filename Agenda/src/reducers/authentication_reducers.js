import { AUTH_USUARIO, UNAUTH_USUARIO, ERROR } from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case AUTH_USUARIO:
      return { ...state, authenticated: true };
    case UNAUTH_USUARIO:
      return { ...state, authenticated: false };
    case ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  };
}
