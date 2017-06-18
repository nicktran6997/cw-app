/*
 *
 * Search actions
 *
 */
import client from '../../utils/client';
import {
  SEARCH_ACTION,
  PAGE_CHANGE_ACTION,
  AGG_SELECTED_ACTION,
  AGG_REMOVED_ACTION,
  TOGGLE_SORT_ACTION,
  QUERY_CHANGE_ACTION,
} from './constants';

export const searchAction = (dispatch) =>
  (params) => {
    let url;
    if (params.query) {
      url = `/studies/search/${params.query}/json`;
    } else {
      url = '/studies/json';
    }
    return client.post(url, params)
      .then((data) =>
        dispatch({
          type: SEARCH_ACTION,
          data: Object.assign(data.data, {
            query: params.query,
            page: params.page,
            aggsSent: params.agg_filters,
            sorts: params.sorts,
          }),
        }));
  };

export const pageChangeAction = (dispatch) =>
  (args) =>
    Promise.resolve(dispatch({
      type: PAGE_CHANGE_ACTION,
      data: args,
    }));

export const selectAggAction = (dispatch) =>
  (field, key) =>
    Promise.resolve(dispatch({
      type: AGG_SELECTED_ACTION,
      data: { [field]: { [key]: 1 } },
    }));

export const removeAggAction = (dispatch) =>
  (field, key) =>
    Promise.resolve(dispatch({
      type: AGG_REMOVED_ACTION,
      data: [field, key],
    }));

export const toggleSortAction = (dispatch) =>
  (field) =>
    Promise.resolve(dispatch({
      type: TOGGLE_SORT_ACTION,
      data: field,
    }));

export const queryChangeAction = (dispatch) =>
  (query) => Promise.resolve(dispatch({
    type: QUERY_CHANGE_ACTION,
    data: query,
  }));

export const getSearchParams = (props, query) => Object.assign({
  query: query || getQuery(props),
  start: (props.Search.page) * props.pageLength,
  length: props.pageLength,
  page: props.Search.page,
  sorts: props.Search.sorts,
}, getAggsObject(props));

export const getQuery = (props) => {
  if (props.Search && props.Search.query) {
    return props.Search.query;
  }
  if (props.params && props.params.query) {
    return props.params.query;
  }
  if (!props.location.pathname.match(/\/search\/$/) &&
      props.Auth && props.Auth.user
      && props.Auth.user.default_query_string) {
    return props.Auth.user.default_query_string;
  }
  return '';
};

export const getAggsObject = (props) => {
  if (props.Search.aggsSent) {
    return { agg_filters: props.Search.aggsSent };
  }
  return {};
};
