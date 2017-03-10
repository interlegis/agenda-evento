import { ERROR } from '../types';

export function ErrorMessage(error) {
  return{
    type: ERROR,
    payload: error
  }
}
