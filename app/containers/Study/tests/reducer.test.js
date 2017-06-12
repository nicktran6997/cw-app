
import { fromJS } from 'immutable';
import studyReducer from '../reducer';

describe('studyReducer', () => {
  it('returns the initial state', () => {
    expect(studyReducer(undefined, {})).toEqual(fromJS({}));
  });
});
