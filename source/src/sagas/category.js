import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/category';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_CATEGORY_LIST,
    GET_CATEGORY_BY_ID,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    CREATE_CATEGORY,
} = actionTypes;


function* getCategoryList({ payload: { params } }) {

    const apiParams = apiConfig.category.getList;
    const searchParams = { page: params.page, size: params.size };

    if(params.kind) {
        searchParams.kind = params.kind
    }

    if(params.parentId) {
        searchParams.parentId = params.parentId
    }

    if(params.search) {
        if(params.search.name) {
            searchParams.name = params.search.name
        }
        if(params.search.status) {
            searchParams.status = params.search.status
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_CATEGORY_LIST),
            categoryData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_CATEGORY_LIST) });
    }
}

function* getCategoryById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.category.getById,
            path: `${apiConfig.category.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createCategory({payload: { params, onCompleted, onError }}){
    try {
        const apiParams = apiConfig.category.create;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateCategory({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.category.update;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteCategory({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.category.delete,
            path: `${apiConfig.category.delete.path}/${params.id}`
        }
        const { success, responseData } = yield call(sendRequest, apiParams);
        handleApiResponse({ success, responseData }, onCompleted, onError);

        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_CATEGORY) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_CATEGORY) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_CATEGORY_LIST), getCategoryList),
    takeLatest(GET_CATEGORY_BY_ID, getCategoryById),
    takeLatest(UPDATE_CATEGORY, updateCategory),
    takeLatest(CREATE_CATEGORY, createCategory),
    takeLatest(defineActionLoading(DELETE_CATEGORY), deleteCategory),
]

export default sagas;