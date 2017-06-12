/*
 *
 * Search reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
} from './constants';

const initialState = fromJS({});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state
        .set('query', action.data.query)
        .set('aggsSent', action.data.aggsSent)
        .set('page', action.data.page)
        .set('total', action.data.recordsTotal)
        .set('totalFiltered', action.data.recordsFiltered)
        .set('rows', action.data.data)
        .set('aggs', action.data.aggs);
    default:
      return state;
  }
}

export default searchReducer;
