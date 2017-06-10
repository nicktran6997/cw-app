/*
 *
 * Search actions
 *
 */
import axios from 'axios';
import {
  DEFAULT_ACTION,
} from './constants';

export const defaultAction = (dispatch) =>
  () =>
    axios.post('http://localhost:3000/studies/search//json', {}).then((data) =>
      dispatch({
        type: DEFAULT_ACTION,
        data: data.data,
      }));
