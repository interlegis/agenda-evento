import { GET_PEDIDOS_USER } from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case GET_PEDIDOS_USER:
      return { ...state, pedidos: action.payload };
    default:
      return state;
  };
}
