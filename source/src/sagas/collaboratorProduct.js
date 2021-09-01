import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/collaboratorProduct';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';
import { UserTypes } from '../constants';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_COLLABORATOR_PRODUCT_LIST,
    GET_COLLABORATOR_PRODUCT_BY_ID,
    CREATE_COLLABORATOR_PRODUCT,
    UPDATE_COLLABORATOR_PRODUCT,
    DELETE_COLLABORATOR_PRODUCT,
    GET_COLLABORATOR_CATEGORY_LIST,
    GET_COLLABORATOR_CATEGORY_PRODUCT,
} = actionTypes;


function* getCollaboratorProductList({ payload: { params, onCompleted } }) {

    const apiParams = apiConfig.collaboratorProduct.getList;
    const searchParams = { };

    if(params.collaboratorId) {
        searchParams.collaboratorId = params.collaboratorId;
    }
    if(params.page) {
        searchParams.page = params.page;
    }
    if(params.size) {
        searchParams.size = params.size;
    }
    if(params.search) {
        if(params.search.status)
            searchParams.status = params.search.status;
        if(params.search.productName) {
            searchParams.productName = params.search.productName
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        onCompleted && onCompleted(result.responseData?.data?.data)
        yield put({
            type: defineActionSuccess(GET_COLLABORATOR_PRODUCT_LIST),
            collaboratorProductData: result.responseData && result.responseData.data
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_COLLABORATOR_PRODUCT_LIST) });
    }
}

function* getCollaboratorCategoryList({ payload: { params, onCompleted, onError } }) {

    const apiParams = apiConfig.collaboratorProduct.categoryAutoComplete;
    const searchParams = { };

    if(params.kind) {
        searchParams.kind = params.kind;
    }

    try {
        const {success, responseData} = yield call(sendRequest, apiParams, searchParams);
        if(success && responseData.result) {
            onCompleted && onCompleted(responseData.data?.data || [])
        }
        else {
            onError && onError()
        }
    }
    catch(error) {
        onError && onError(error)
    }
}

function* getCollaboratorCategoryProductList({ payload: { params, onCompleted, onError } }) {

    const apiParams = apiConfig.collaboratorProduct.getCollaboratorCategoryProductList;
    const searchParams = { };

    if(params.collaboratorCategoryId) {
        searchParams.collaboratorCategoryId = params.collaboratorCategoryId;
    }

    try {
        const {success, responseData} = yield call(sendRequest, apiParams, searchParams);
        if(success && responseData.result) {
            onCompleted && onCompleted(responseData.data?.data || [])
        }
        else {
            onError && onError()
        }
    }
    catch(error) {
        onError && onError(error)
    }
}

function* getCollaboratorProductById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.collaboratorProduct.getById,
            path: `${apiConfig.collaboratorProduct.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createCollaboratorProduct({ payload: { params, onCompleted, onError } }) {

    try {
        const result = yield call(sendRequest, apiConfig.collaboratorProduct.create, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateCollaboratorProduct({ payload: { params, onCompleted, onError } }) {
    try {
        const result = yield call(sendRequest, apiConfig.collaboratorProduct.update, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteCollaboratorProduct({ payload: { params, onCompleted, onError } }) {
    try {
        const result = yield call(sendRequest, apiConfig.collaboratorProduct.delete, params);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_COLLABORATOR_PRODUCT) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_COLLABORATOR_PRODUCT) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_COLLABORATOR_PRODUCT_LIST), getCollaboratorProductList),
    takeLatest(GET_COLLABORATOR_CATEGORY_LIST, getCollaboratorCategoryList),
    takeLatest(GET_COLLABORATOR_CATEGORY_PRODUCT, getCollaboratorCategoryProductList),
    takeLatest(GET_COLLABORATOR_PRODUCT_BY_ID, getCollaboratorProductById),
    takeLatest(CREATE_COLLABORATOR_PRODUCT, createCollaboratorProduct),
    takeLatest(UPDATE_COLLABORATOR_PRODUCT, updateCollaboratorProduct),
    takeLatest(defineActionLoading(DELETE_COLLABORATOR_PRODUCT), deleteCollaboratorProduct),
]

export default sagas;