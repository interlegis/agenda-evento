import { GET_PEDIDOS_USER, GET_PEDIDOS_CONCORRENTES, GET_TODOS_PEDIDOS } from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case GET_PEDIDOS_USER:
      return { ...state, pedidos: action.payload };
    case GET_PEDIDOS_CONCORRENTES:
      return { ...state, eventosConcorrentes: action.payload };
    case GET_TODOS_PEDIDOS:
    console.log(action.payload);
      return { ...state, todosPedidos: action.payload };
    default:
      return state;
  };
}
