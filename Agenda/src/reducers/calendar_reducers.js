import { SAVE_CALENDAR, SAVE_CALENDAR_NEWS } from '../actions/types';

export default function( state = [] , action) {
  switch (action.type) {
    case SAVE_CALENDAR:
      return action.payload;
    case SAVE_CALENDAR_NEWS:
      return action.payload;
    default:
      return state;
  };
}
