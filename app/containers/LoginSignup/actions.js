/*
 *
 * LoginSignup actions
 *
 */

import axios from 'axios';
import {
  DEFAULT_ACTION,
  SIGNUP_ACTION,
  SIGNUP_ERRORS_ACTION,
  LOGIN_ACTION,
  LOGIN_ERRORS_ACTION,
  LOGOUT_ACTION,
  LOGOUT_ERRORS_ACTION,
  IS_LOGGED_IN_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const loginAction = (dispatch) =>
  (params) =>
    axios.post('http://localhost:3000/users/sign_in', Object.assign({ withCredentials: true }, params))
      .catch((errors) => dispatch({
        type: LOGIN_ERRORS_ACTION,
        data: errors,
      }))
      .then((data) => dispatch({
        type: LOGIN_ACTION,
        data: data.data,
      }));

export const signupAction = (dispatch) =>
  (params) =>
    axios.post('http://localhost:3000/users', Object.assign({ withCredentials: true }, params))
      .catch((error) => {
        dispatch({
          type: SIGNUP_ERRORS_ACTION,
          data: error.response.data,
        });
        throw error;
      }).then((data) => dispatch({
        type: SIGNUP_ACTION,
        data: data.data,
      }));

export const logoutAction = (dispatch) =>
  () =>
    axios.delete('http://localhost:3000/users/session')
      .catch((error) => {
        dispatch({
          type: LOGOUT_ERRORS_ACTION,
          data: error.response.data,
        });
        throw error;
      }).then((data) => dispatch({
        type: LOGOUT_ACTION,
        data: data.data,
      }));

export const sessionExistsAction = (dispatch) =>
  () =>
    axios.get('http://localhost:3000/user/exists', { withCredentials: true })
      .catch(() => ({ data: { isLoggedIn: false } }))
      .then((data) => dispatch({
        type: IS_LOGGED_IN_ACTION,
        data: data.data,
      }));
