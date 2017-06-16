import client from '../../utils/client';
import {
  DEFAULT_ACTION,
  PROFILE_SUBMIT_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const profileSubmitAction = (dispatch) =>
  (profileData) =>
    client.patch('/users.json', profileData)
    .then(dispatch({
      type: PROFILE_SUBMIT_ACTION,
    }));
