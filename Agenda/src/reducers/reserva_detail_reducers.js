import { RESERVA_GET, EVENTO_GET } from '../actions/types';

export default function( state = {} , action) {
  switch (action.type) {
    case RESERVA_GET:
      return { ...state, reserva_id: action.payload };
    case EVENTO_GET:
      return { ...state, evento_id: action.payload };
    default:
      return state;
  };
}
