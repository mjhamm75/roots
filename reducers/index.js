import { RESET_ERROR_MESSAGE } from './../constants/roots.constants.js';
import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action;

  if (type === RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return action.error;
  }

  return state;
}

const rootReducer = combineReducers({
  errorMessage,
  router,
});

export default rootReducer;