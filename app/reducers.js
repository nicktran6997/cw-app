/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  LOGIN_ACTION,
  SIGNUP_ACTION,
  LOGOUT_ACTION,
  IS_LOGGED_IN_ACTION,
  SHOULD_OPEN_LOGIN_MODAL,
  CLEAR_MODAL_ACTION,
} from './containers/LoginSignup/constants';
import languageProviderReducer from './containers/LanguageProvider/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  locationBeforeTransitions: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

const authInitialState = fromJS({
  loggedIn: false,
  shouldOpenLoginModal: false,
});

function authReducer(state = authInitialState, action) {
  switch (action.type) {
    case LOGIN_ACTION:
    case SIGNUP_ACTION:
      return state
        .set('loggedIn', true)
        .set('shouldOpenLoginModal', false);
    case IS_LOGGED_IN_ACTION:
      return state
        .set('loggedIn', action.data.loggedIn)
        .set('user', action.data);
    case LOGOUT_ACTION:
      return state
      .set('loggedIn', false)
      .set('user', null);
    case SHOULD_OPEN_LOGIN_MODAL:
      return state
        .set('shouldOpenLoginModal', true);
    case CLEAR_MODAL_ACTION:
      return state
        .set('shouldOpenLoginModal', false);
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    auth: authReducer,
    route: routeReducer,
    language: languageProviderReducer,
    ...asyncReducers,
  });
}
