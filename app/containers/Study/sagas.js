import { put, takeEvery, call, take, cancel, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  REQUEST_STUDY_ACTION,
  RELOAD_STUDY_ACTION,
  WIKI_SUBMIT_ACTION,
  ANNOTATION_CREATE_ACTION,
  ANNOTATION_DELETE_ACTION,
  ANNOTATION_UPDATE_ACTION,
  TAG_REMOVE_ACTION,
  TAG_SUBMIT_ACTION,
  SET_WIKI_OVERRIDE_ACTION,
} from './constants';
import { makeSelectWikiOverride } from './selectors';
import {
  defaultAction,
  trackingAction,
  descriptiveAction,
  adminAction,
  recruitmentAction,
  reviewsAction,
  wikiAction,
} from './actions';
import client from '../../utils/client';

export function* loadDefault(action) {
  const override = yield select(makeSelectWikiOverride());
  const data = yield client.get(`/studies/${action.nctId}/json?wiki_override=${override}`);
  yield put(defaultAction(data.data));
}

export function* loadTracking(action) {
  const data = yield client.get(`/studies/${action.nctId}/tracking`);
  yield put(trackingAction(data.data));
}

export function* loadDescriptive(action) {
  const data = yield client.get(`/studies/${action.nctId}/descriptive`);
  yield put(descriptiveAction(data.data));
}

export function* loadAdmin(action) {
  const data = yield client.get(`/studies/${action.nctId}/administrative`);
  yield put(adminAction(data.data));
}

export function* loadRecruitment(action) {
  const data = yield client.get(`/studies/${action.nctId}/recruitment`);
  yield put(recruitmentAction(data.data));
}

export function* loadReviews(action) {
  const data = yield client.get(`reviews.json?nct_id=${action.nctId}`);
  yield put(reviewsAction(data.data));
}

export function* loadWiki(action) {
  const data = yield client.get(`/studies/${action.nctId}/wiki`);
  yield put(wikiAction(data.data));
}

export function* loadStudy(action) {
  yield call(loadDefault, action);
  yield call(loadWiki, action);
  yield call(loadTracking, action);
  yield call(loadDescriptive, action);
  yield call(loadAdmin, action);
  yield call(loadRecruitment, action);
  yield call(loadReviews, action);
}

export function* reloadStudy(action) {
  yield call(loadDefault, action);
  yield call(loadWiki, action);
  yield call(loadReviews, action);
}

export const wikiUrl = (action) => `/studies/${action.nctId}/wiki`;

export function* submitWiki(action) {
  yield client.post(
    wikiUrl(action),
    { wiki_text: action.wikiText }
  );
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* postAnnotation(action) {
  yield client.post(
    wikiUrl(action),
    { add_meta: action }
  );
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* deleteAnnotation(action) {
  yield client.post(
    wikiUrl(action),
    { delete_meta: { key: action.key } }
  );
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* submitTag(action) {
  yield client.post(
    wikiUrl(action),
    { add_tag: action.tag }
  );
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* removeTag(action) {
  yield client.post(
    wikiUrl(action),
    { remove_tag: action.tag }
  );
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* reloadStudySaga() {
  const requestWatcher = yield takeEvery(REQUEST_STUDY_ACTION, loadStudy);
  const reloadWatcher = yield takeEvery(RELOAD_STUDY_ACTION, reloadStudy);

  yield take(LOCATION_CHANGE);

  yield cancel(requestWatcher);
  yield cancel(reloadWatcher);
}

export function* wikiSaga() {
  const submitWatcher = yield takeEvery(WIKI_SUBMIT_ACTION, submitWiki);
  yield take(LOCATION_CHANGE);
  yield cancel(submitWatcher);
}

export function* annotationsSaga() {
  const createAnnotationWatcher = yield takeEvery(ANNOTATION_CREATE_ACTION, postAnnotation);
  const deleteAnnotationWatcher = yield takeEvery(ANNOTATION_DELETE_ACTION, deleteAnnotation);
  const updateAnnotationWatcher = yield takeEvery(ANNOTATION_UPDATE_ACTION, postAnnotation);

  yield take(LOCATION_CHANGE);

  yield cancel(createAnnotationWatcher);
  yield cancel(deleteAnnotationWatcher);
  yield cancel(updateAnnotationWatcher);
}

export function* tagsSaga() {
  const removeTagWatcher = yield takeEvery(TAG_REMOVE_ACTION, removeTag);
  const submitTagWatcher = yield takeEvery(TAG_SUBMIT_ACTION, submitTag);

  yield take(LOCATION_CHANGE);

  yield cancel(removeTagWatcher);
  yield cancel(submitTagWatcher);
}

export function* wikiOverrideSaga() {
  const overrideWatcher = yield takeEvery(SET_WIKI_OVERRIDE_ACTION, reloadStudy);
  yield take(LOCATION_CHANGE);
  yield cancel(overrideWatcher);
}

export default [
  reloadStudySaga,
  wikiSaga,
  annotationsSaga,
  tagsSaga,
  wikiOverrideSaga,
];
