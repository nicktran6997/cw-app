/*
 *
 * Study actions
 *
 */
import client from '../../utils/client';
import {
  DEFAULT_ACTION,
  CROWD_ACTION,
  TRACKING_ACTION,
  DESCRIPTIVE_ACTION,
  ADMINISTRATIVE_ACTION,
  RECRUITMENT_ACTION,
  TAG_REMOVE_ACTION,
  TAG_SUBMIT_ACTION,
  REVIEW_SUBMIT_ACTION,
  REVIEW_UPDATE_ACTION,
  REVIEWS_RECEIVE_ACTION,
  REVIEW_RECEIVE_ACTION,
  REVIEW_DELETE_ACTION,
  ANNOTATION_CREATE_ACTION,
  ANNOTATION_DELETE_ACTION,
  ANNOTATION_UPDATE_ACTION,
} from './constants';

export const defaultAction = (dispatch, nctId) =>
  () =>
    client.get(`/studies/${nctId}/json`)
    .then((data) =>
      dispatch({
        type: DEFAULT_ACTION,
        data: data.data,
      }));

export const crowdAction = (dispatch, nctId) =>
  () =>
    client.get(`/studies/${nctId}/crowd`)
    .then((data) =>
      dispatch({
        type: CROWD_ACTION,
        data: data.data,
      }));

export const trackingAction = (dispatch, nctId) =>
  () =>
    client.get(`/studies/${nctId}/tracking`)
    .then((data) =>
      dispatch({
        type: TRACKING_ACTION,
        data: data.data,
      }));

export const descriptiveAction = (dispatch, nctId) =>
  () =>
    client.get(`/studies/${nctId}/descriptive`)
    .then((data) =>
      dispatch({
        type: DESCRIPTIVE_ACTION,
        data: data.data,
      }));

export const adminAction = (dispatch, nctId) =>
  () =>
    client.get(`/studies/${nctId}/administrative`)
    .then((data) =>
      dispatch({
        type: ADMINISTRATIVE_ACTION,
        data: data.data,
      }));

export const recruitmentAction = (dispatch, nctId) =>
  () =>
    client.get(`/studies/${nctId}/recruitment`)
    .then((data) =>
      dispatch({
        type: RECRUITMENT_ACTION,
        data: data.data,
      }));

export const removeTagAction = (dispatch) =>
  (nctId, tagId) =>
    client.delete(`/tags/${tagId}`, { nct_id: nctId })
    .then(() => dispatch({
      type: TAG_REMOVE_ACTION,
    }));

export const submitTagAction = (dispatch) =>
  (nctId, newTag) =>
    client.post('/tags', {
      nct_id: nctId,
      new_tag: newTag,
    }).then((data) => dispatch({
      type: TAG_SUBMIT_ACTION,
      data: data.data,
    }));

export const updateAnnotationAction = (dispatch) =>
  (annotationId, description) =>
    client.patch(`/annotations/${annotationId}.json`, { description })
    .then(() =>
      dispatch({
        type: ANNOTATION_UPDATE_ACTION,
      }));

export const deleteAnnotationAction = (dispatch) =>
  (annotationId) =>
    client.delete(`/annotations/${annotationId}.json`)
    .then(() =>
      dispatch({
        type: ANNOTATION_DELETE_ACTION,
      }));

export const createAnnotationAction = (dispatch) =>
  (nctId, label, description) =>
    client.post('/annotations.json', { nct_id: nctId, label, description })
    .then(() =>
      dispatch({
        type: ANNOTATION_CREATE_ACTION,
      }));


export const submitReviewAction = (dispatch) =>
  (nctId, comment, rating) =>
    client.post('/reviews.json', { nct_id: nctId, comment, rating })
    .then(() =>
      dispatch({
        type: REVIEW_SUBMIT_ACTION,
      }));

export const updateReviewAction = (dispatch) =>
  (reviewId, comment, rating) =>
    client.patch(`/reviews/${reviewId}.json`, { comment, rating })
    .then(() =>
      dispatch({
        type: REVIEW_UPDATE_ACTION,
      }));

export const reviewsAction = (dispatch, nctId) =>
  () =>
    client.get(`reviews.json?nct_id=${nctId}`)
      .then((data) => dispatch({
        type: REVIEWS_RECEIVE_ACTION,
        data: data.data,
      }));

export const getReviewAction = (dispatch) =>
  (reviewId) =>
    client.get(`reviews/${reviewId}`)
      .then((data) => dispatch({
        type: REVIEW_RECEIVE_ACTION,
        data: data.data,
      }));

export const deleteReviewAction = (dispatch) =>
  (reviewId) =>
    client.delete(`reviews/${reviewId}.json`)
      .then(() => dispatch({
        type: REVIEW_DELETE_ACTION,
      }));
