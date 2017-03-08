import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authentication_Reducer from './authentication_reducers';
import user_reducer from './user_reducers';

const rootReducer = combineReducers({
  form,
  authentication: authentication_Reducer,
  user: user_reducer
});

export default rootReducer;
