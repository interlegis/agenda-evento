import { PEDIDO_RECEBIDO, PEDIDO_NEGADO, ERRO_TRAMITAR_PEDIDO} from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case PEDIDO_RECEBIDO:
      return action.payload;
    case PEDIDO_NEGADO:
      return action.payload;
    case ERRO_TRAMITAR_PEDIDO:
      return action.payload;
    default:
      return state;
  };
}
