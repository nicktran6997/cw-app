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
        .set('total', action.data.recordsTotal)
        .set('totalFiltered', action.data.recordsFiltered)
        .set('rows', action.data.data);
    default:
      return state;
  }
}

export default searchReducer;
