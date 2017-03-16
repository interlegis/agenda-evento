import { USUARIO, UPDATE_USUARIO } from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case USUARIO:
      return { ...state, usuario: action.payload };
    case UPDATE_USUARIO:
      return { ...state, usuario: action.payload };
    default:
      return state;
  };
}
