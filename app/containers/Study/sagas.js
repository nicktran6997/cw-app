import { put, takeEvery, call } from 'redux-saga/effects';
import {
  REQUEST_STUDY_ACTION,
  RELOAD_STUDY_ACTION,
} from './constants';
import {
  defaultAction,
  crowdAction,
  trackingAction,
  descriptiveAction,
  adminAction,
  recruitmentAction,
  reviewsAction,
} from './actions';
import client from '../../utils/client';

export function* loadDefault(action) {
  const data = yield client.get(`/studies/${action.nctId}/json`);
  yield put(defaultAction(data.data));
}

export function* loadCrowd(action) {
  const data = yield client.get(`/studies/${action.nctId}/crowd`);
  yield put(crowdAction(data.data));
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

export function* loadStudy(action) {
  yield call(loadDefault, action);
  yield call(loadCrowd, action);
  yield call(loadTracking, action);
  yield call(loadDescriptive, action);
  yield call(loadAdmin, action);
  yield call(loadRecruitment, action);
  yield call(loadReviews, action);
}

export function* reloadStudy(action) {
  yield call(loadDefault, action);
  yield call(loadReviews, action);
  yield call(loadCrowd, action);
}

export function* studySaga() {
  yield takeEvery(REQUEST_STUDY_ACTION, loadStudy);
  yield takeEvery(RELOAD_STUDY_ACTION, reloadStudy);
}

export default [
  studySaga,
];
