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
  (params) =>
    axios.post(`http://localhost:3000/studies/search/${params.query}/json`,
      Object.assign({ withCredentials: true }, params)).then((data) =>
      dispatch({
        type: DEFAULT_ACTION,
        data: Object.assign(data.data, {
          query: params.query,
          page: params.page,
          aggsSent: params.agg_filters,
          sorts: params.sorts,
        }),
      }));
