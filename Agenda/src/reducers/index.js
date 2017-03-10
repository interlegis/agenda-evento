import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authentication_Reducer from './authentication_reducers';
import user_reducer from './user_reducers';
import pedidos_reducers from './pedidos_reducers';
import reserva_detail_reducers from './reserva_detail_reducers';

const rootReducer = combineReducers({
  form: formReducer,
  authentication: authentication_Reducer,
  user: user_reducer,
  pedidos: pedidos_reducers,
  pedido_detail: reserva_detail_reducers
});

export default rootReducer;
