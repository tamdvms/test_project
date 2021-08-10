import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/employee';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';
import { UserTypes } from '../constants';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_EMPLOYEE_LIST,
    GET_EMPLOYEE_BY_ID,
    CREATE_EMPLOYEE,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
} = actionTypes;


function* getEmployeeList({ payload: { params } }) {

    const apiParams = apiConfig.user.getAdminList;
    const searchParams = { page: params.page, size: params.size , kind: UserTypes.EMPLOYEE};
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
            type: defineActionSuccess(GET_EMPLOYEE_LIST),
            employeeData: result.responseData && result.responseData.data
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_EMPLOYEE_LIST) });
    }
}

function* getEmployeeById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.user.getAdminById,
            path: `${apiConfig.user.getAdminById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createEmployee({ payload: { params, onCompleted, onError } }) {

    try {
        const result = yield call(sendRequest, apiConfig.user.createAdmin, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateEmployee({ payload: { params, onCompleted, onError } }) {
    try {
        const result = yield call(sendRequest, apiConfig.user.updateAdmin, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteEmployee({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.user.deleteAdmin,
            path: `${apiConfig.user.deleteAdmin.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_EMPLOYEE) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_EMPLOYEE) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_EMPLOYEE_LIST), getEmployeeList),
    takeLatest(GET_EMPLOYEE_BY_ID, getEmployeeById),
    takeLatest(CREATE_EMPLOYEE, createEmployee),
    takeLatest(UPDATE_EMPLOYEE, updateEmployee),
    takeLatest(defineActionLoading(DELETE_EMPLOYEE), deleteEmployee),
]

export default sagas;