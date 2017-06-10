/*
 *
 * Search actions
 *
 */
import axios from 'axios';
import {
  DEFAULT_ACTION,
} from './constants';

export const defaultAction = (dispatch, params) =>
  () =>
    axios.post(`http://localhost:3000/studies/search/${params.query}/json`,
      params).then((data) =>
      dispatch({
        type: DEFAULT_ACTION,
        data: data.data,
      }));
