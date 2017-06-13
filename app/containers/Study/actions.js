/*
 *
 * Study actions
 *
 */
import axios from 'axios';
import {
  DEFAULT_ACTION,
  CROWD_ACTION,
  TRACKING_ACTION,
  DESCRIPTIVE_ACTION,
  ADMINISTRATIVE_ACTION,
  RECRUITMENT_ACTION,
} from './constants';

export const defaultAction = (dispatch, nctId) =>
  () =>
    axios.get(`http://localhost:3000/studies/${nctId}/json`, { withCredentials: true })
    .then((data) =>
      dispatch({
        type: DEFAULT_ACTION,
        data: data.data,
      }));

export const crowdAction = (dispatch, nctId) =>
  () =>
    axios.get(`http://localhost:3000/studies/${nctId}/crowd`, { withCredentials: true })
    .then((data) =>
      dispatch({
        type: CROWD_ACTION,
        data: data.data,
      }));

export const trackingAction = (dispatch, nctId) =>
  () =>
    axios.get(`http://localhost:3000/studies/${nctId}/tracking`, { withCredentials: true })
    .then((data) =>
      dispatch({
        type: TRACKING_ACTION,
        data: data.data,
      }));

export const descriptiveAction = (dispatch, nctId) =>
  () =>
    axios.get(`http://localhost:3000/studies/${nctId}/descriptive`, { withCredentials: true })
    .then((data) =>
      dispatch({
        type: DESCRIPTIVE_ACTION,
        data: data.data,
      }));

export const adminAction = (dispatch, nctId) =>
  () =>
    axios.get(`http://localhost:3000/studies/${nctId}/administrative`, { withCredentials: true })
    .then((data) =>
      dispatch({
        type: ADMINISTRATIVE_ACTION,
        data: data.data,
      }));

export const recruitmentAction = (dispatch, nctId) =>
  () =>
    axios.get(`http://localhost:3000/studies/${nctId}/recruitment`, { withCredentials: true })
    .then((data) =>
      dispatch({
        type: RECRUITMENT_ACTION,
        data: data.data,
      }));
