import { USUARIO } from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case USUARIO:
      return { ...state, usuario: action.payload };
    default:
      return state;
  };
}
