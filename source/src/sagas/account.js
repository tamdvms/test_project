import { call, takeLatest, put } from "redux-saga/effects";

import { sendRequest } from "../services/apiService";
import { actionTypes, reduxUtil } from "../actions/account";
import { actions } from "../actions";
import apiConfig from "../constants/apiConfig";
// import { handleApiResponse } from '../utils/apiHelper';
import { UserTypes } from "../constants";

const { LOGIN, LOGOUT, UPDATE_PROFILE, GET_PROFILE } = actionTypes;

const {
  defineActionLoading,
  defineActionSuccess,
  defineActionFailed,
} = reduxUtil;

function* login({ payload: { params, onCompleted, onError } }) {
  try {
    const result = yield call(sendRequest, apiConfig.account.login, params);
    const { success, responseData } = result;
    if (success && responseData.result) {
      const profileResult = yield call(
        sendRequest,
        apiConfig.account.getAdminProfile,
        {},
        responseData.data.token
      );
      const settingResult = yield call(sendRequest, apiConfig.setting.getSettingsClientList, {}, responseData.data.token);
      if (profileResult.success && profileResult.responseData.result
        && settingResult.success && settingResult.responseData.result
        && settingResult.responseData.data) {
        let permissions = [];
        if (
          profileResult.responseData.data.group &&
          profileResult.responseData.data.group.permissions
        ) {
          permissions = profileResult.responseData.data.group.permissions.map(
            (permission) => permission.action
          );
        }
        const settingsData = settingResult.responseData.data?.data || [];
        const groupedSettings = settingsData.reduce((r, a) => {
          r[a.group] = {
            [a.key]: a.value,
            ...r[a.group],
          };
          return r;
        }, {})
        onCompleted({
          token: responseData.data.token,
          id: profileResult.responseData.data.id,
          avatar: profileResult.responseData.data.avatar,
          logo: profileResult.responseData.data.logoPath,
          username: profileResult.responseData.data.username,
          fullName: profileResult.responseData.data.fullName,
          kind: profileResult.responseData.data.kind,
          isSuperAdmin: profileResult.responseData.data.isSuperAdmin,
          permissions,
          settings: groupedSettings
        });
      } else {
        onError(responseData);
      }
    } else {
      onError(responseData);
    }
  } catch (error) {
    console.log(error);
    onError(error);
  }
}

function* logout() {
  try {
    yield call(sendRequest, apiConfig.account.logout);
  } catch (error) {
    // onError(error);
  }
}

function* getProfile({ payload }) {
  try {
    const result = yield call(sendRequest, apiConfig.account.getAdminProfile);
    yield put({
      type: defineActionSuccess(GET_PROFILE),
      data: result.responseData && result.responseData.data,
    });
    yield put(actions.hideFullScreenLoading());
  } catch (error) {
    yield put({ type: defineActionFailed(GET_PROFILE) });
  }
}

function* updateProfile({ payload: { params, onCompleted, onError } }) {
  try {
    const userData = yield call(sendRequest, apiConfig.account.updateProfileAdmin, params);
    onCompleted(userData);
  } catch (error) {
    onError();
  }
}

const sagas = [
  takeLatest(defineActionLoading(LOGIN), login),
  takeLatest(LOGOUT, logout),
  takeLatest(GET_PROFILE, getProfile),
  takeLatest(defineActionLoading(UPDATE_PROFILE), updateProfile),
];

export default sagas;
