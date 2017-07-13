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
  REQUEST_STUDY_ACTION,
  RELOAD_STUDY_ACTION,
  WIKI_ACTION,
  WIKI_SUBMIT_ACTION,
} from './constants';

export const getStudyAction = (nctId) => ({
  type: REQUEST_STUDY_ACTION,
  nctId,
});

export const reloadStudyAction = (nctId) => ({
  type: RELOAD_STUDY_ACTION,
  nctId,
});

export const wikiAction = (data) => ({
  type: WIKI_ACTION,
  data,
});

export const wikiSubmitAction = (nctId, wikiText) => ({
  type: WIKI_SUBMIT_ACTION,
  nctId,
  wikiText,
});

export const createAnnotationAction = (nctId, key, value) => ({
  type: ANNOTATION_CREATE_ACTION,
  nctId,
  key,
  value,
});

export const updateAnnotationAction = (nctId, key, value) => ({
  type: ANNOTATION_UPDATE_ACTION,
  nctId,
  key,
  value,
});

export const deleteAnnotationAction = (nctId, key) => ({
  type: ANNOTATION_DELETE_ACTION,
  nctId,
  key,
});

export const defaultAction = (data) => ({
  type: DEFAULT_ACTION,
  data,
});

export const crowdAction = (data) => ({
  type: CROWD_ACTION,
  data,
});

export const trackingAction = (data) => ({
  type: TRACKING_ACTION,
  data,
});

export const descriptiveAction = (data) => ({
  type: DESCRIPTIVE_ACTION,
  data,
});

export const adminAction = (data) => ({
  type: ADMINISTRATIVE_ACTION,
  data,
});

export const recruitmentAction = (data) => ({
  type: RECRUITMENT_ACTION,
  data,
});

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

export const reviewsAction = (data) => ({
  type: REVIEWS_RECEIVE_ACTION,
  data,
});

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
