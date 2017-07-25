import { fromJS } from 'immutable';
import {
  SEARCH_ACTION,
  PAGE_CHANGE_ACTION,
  AGG_SELECTED_ACTION,
  AGG_REMOVED_ACTION,
  TOGGLE_SORT_ACTION,
  QUERY_CHANGE_ACTION,
  AGG_BUCKETS_RECEIVED_ACTION,
  TOGGLE_COLUMN_PICKER_ACTION,
  PICK_COLUMN_ACTION,
} from './constants';

const initialState = fromJS({
  total: 0,
  page: 0,
  aggsSent: {},
  sorts: {},
  aggs: {},
  query: '',
  prevQuery: '',
  columns: {
    nctId: true,
    'Overall Rating': true,
    status: true,
    title: true,
    started: true,
    completed: true,
  },
});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case PICK_COLUMN_ACTION:
      return state.updateIn(['columns', action.column], (x) => !x);
    case TOGGLE_COLUMN_PICKER_ACTION:
      return state.update('columnPickerOpen', (x) => !x);
    case SEARCH_ACTION:
      return state
        .set('query', action.data.query)
        .set('aggsSent', action.data.aggsSent)
        .set('page', action.data.page)
        .set('total', action.data.recordsTotal)
        .set('totalFiltered', action.data.recordsFiltered)
        .set('rows', action.data.data)
        .set('aggs', action.data.aggs)
        .update('columns', (cols) => {
          const origCols = (cols.toJS && cols.toJS()) || cols;
          const newCols = Object.assign({}, origCols);
          action.data.aggs.rating_dimensions.buckets.forEach((b) => {
            newCols[b.key] = cols[b.key] || false;
          });
          // if we actually have settings, override them
          return fromJS(Object.assign(newCols, origCols));
        });
    case PAGE_CHANGE_ACTION:
      return state.set('page', action.data.selected);
    case AGG_SELECTED_ACTION:
      return state
        .update('aggsSent', (as) => Object.assign(as, {
          [action.field]: Object.assign({}, { [action.key]: 1 }, as[action.field]),
        }))
        .set('page', 0)
        .update('aggs', (as) => {
          const newAggs = as;
          Object.keys(as).forEach((k) => {
            newAggs[k].loaded = false;
          });
          return newAggs;
        });
    /* eslint-disable no-case-declarations */
    case AGG_REMOVED_ACTION:
      const aggs = state.get('aggsSent');
      delete aggs[action.data[0]][action.data[1]];
      return state
        .set('aggsSent', aggs)
        .set('page', 0);
    case AGG_BUCKETS_RECEIVED_ACTION:
      return state
        .update('aggs', (aggState) =>
          Object.assign(aggState, { [action.agg]: Object.assign({ loaded: true }, action.data) }));
    case TOGGLE_SORT_ACTION:
      switch (state.getIn(['sorts', action.data])) {
        case 'asc':
          return state.deleteIn(['sorts', action.data]);
        case 'desc':
          return state.setIn(['sorts', action.data], 'asc');
        default:
          return state.setIn(['sorts', action.data], 'desc');
      }
    case QUERY_CHANGE_ACTION:
      return state
      .set('prevQuery', state.get('query'))
      .set('query', action.data)
      .set('page', 0);
    default:
      return state;
  }
}

export default searchReducer;
