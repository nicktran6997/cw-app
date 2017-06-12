/*
 *
 * Study reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  CROWD_ACTION,
  TRACKING_ACTION,
  DESCRIPTIVE_ACTION,
  ADMINISTRATIVE_ACTION,
  RECRUITMENT_ACTION,
} from './constants';

const initialState = fromJS({});

function studyReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('study', action.data);
    case CROWD_ACTION:
      return state.set('crowd', action.data);
    case TRACKING_ACTION:
      return state.set('tracking', action.data);
    case DESCRIPTIVE_ACTION:
      return state.set('descriptive', action.data);
    case ADMINISTRATIVE_ACTION:
      return state.set('administrative', action.data);
    case RECRUITMENT_ACTION:
      return state.set('recruitment', action.data);
    default:
      return state;
  }
}

export default studyReducer;
