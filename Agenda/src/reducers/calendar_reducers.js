import { SAVE_CALENDAR } from '../actions/types';

export default function( state = [] , action) {
  switch (action.type) {
    case SAVE_CALENDAR:
      return action.payload;
    default:
      return state;
  };
}
