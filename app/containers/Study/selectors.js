import { createSelector } from 'reselect';

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

export default makeSelectStudy;
export {
  selectStudyDomain,
};
