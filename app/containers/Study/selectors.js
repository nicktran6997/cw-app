import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

/**
 * Direct selector to the study state domain
 */
const selectStudyDomain = () => (state) => state.get('study');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Study
 */

const makeSelectStudy = () => createSelector(
  selectStudyDomain(),
  (substate) => substate.toJS()
);

const makeSelectWikiMeta = () => createSelector(
  selectStudyDomain(),
  (substate) => substate.getIn(['wiki', 'meta'], fromJS({})).toJS()
);

const makeSelectWiki = () => createSelector(
  selectStudyDomain(),
  (substate) => substate.get('wiki', fromJS({})).toJS()
);

export default makeSelectStudy;
export {
  selectStudyDomain,
  makeSelectWikiMeta,
  makeSelectWiki,
};
