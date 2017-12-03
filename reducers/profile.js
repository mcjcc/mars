import { CREATE_PROFILE, FETCH_PROFILE } from '../actions/MovieAction';

export default function (state = {}, action) {
  // if (action.payload) {
  //   console.log('payload', action.payload.data);
  // }
  switch (action.type) {
    case FETCH_PROFILE:
      return action.payload.data;
    case CREATE_PROFILE:
      return action.payload.data ? action.payload.data: state;
    default:
      return state;
  }
}
