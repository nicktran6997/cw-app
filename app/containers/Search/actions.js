/*
 *
 * Search actions
 *
 */
import client from '../../utils/client';
import {
  DEFAULT_ACTION,
} from './constants';

export const defaultAction = (dispatch) =>
  (params) =>
    client.post(`http://localhost:3000/studies/search/${params.query}/json`, params)
      .then((data) =>
        dispatch({
          type: DEFAULT_ACTION,
          data: Object.assign(data.data, {
            query: params.query,
            page: params.page,
            aggsSent: params.agg_filters,
            sorts: params.sorts,
          }),
        }));
