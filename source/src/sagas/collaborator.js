import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/collaborator';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';
import { UserTypes } from '../constants';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_COLLABORATOR_LIST,
    GET_COLLABORATOR_BY_ID,
    CREATE_COLLABORATOR,
    UPDATE_COLLABORATOR,
    DELETE_COLLABORATOR,
    GET_EMPLOYEE_COLLABORATOR_LIST,
} = actionTypes;


function* getCollaboratorList({ payload: { params } }) {

    const apiParams = apiConfig.collaborator.getList;
    const searchParams = { page: params.page, size: params.size };

    if(params.parentId) {
        searchParams.employeeId = params.parentId;
    }
    if(params.search) {
        if(params.search.status)
            searchParams.status = params.search.status;
        if(params.search.username) {
            searchParams.username = params.search.username
        }
        if(params.search.fullName) {
            searchParams.fullName = params.search.fullName
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_COLLABORATOR_LIST),
            collaboratorData: result.responseData && result.responseData.data
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_COLLABORATOR_LIST) });
    }
}


function* getEmployeeCollaboratorList({ payload: { params } }) {

    const apiParams = apiConfig.collaborator.getEmployeeCollaboratorList;

    try {
        const result = yield call(sendRequest, apiParams);
        yield put({
            type: defineActionSuccess(GET_EMPLOYEE_COLLABORATOR_LIST),
            employeeCollaboratorData: result.responseData && result.responseData.data
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_EMPLOYEE_COLLABORATOR_LIST) });
    }
}

function* getCollaboratorById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.collaborator.getById,
            path: `${apiConfig.collaborator.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createCollaborator({ payload: { params, onCompleted, onError } }) {

    try {
        const result = yield call(sendRequest, apiConfig.collaborator.create, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateCollaborator({ payload: { params, onCompleted, onError } }) {
    try {
        const result = yield call(sendRequest, apiConfig.collaborator.update, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteCollaborator({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.collaborator.delete,
            path: `${apiConfig.collaborator.delete.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_COLLABORATOR) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_COLLABORATOR) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_COLLABORATOR_LIST), getCollaboratorList),
    takeLatest(defineActionLoading(GET_EMPLOYEE_COLLABORATOR_LIST), getEmployeeCollaboratorList),
    takeLatest(GET_COLLABORATOR_BY_ID, getCollaboratorById),
    takeLatest(CREATE_COLLABORATOR, createCollaborator),
    takeLatest(UPDATE_COLLABORATOR, updateCollaborator),
    takeLatest(defineActionLoading(DELETE_COLLABORATOR), deleteCollaborator),
]

export default sagas;