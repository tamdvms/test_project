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
} = actionTypes;


function* getCollaboratorProductList({ payload: { params } }) {

    const apiParams = apiConfig.collaboratorProduct.getList;
    const searchParams = { page: params.page, size: params.size };

    if(params.collaboratorId) {
        searchParams.collaboratorId = params.collaboratorId;
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
        yield put({
            type: defineActionSuccess(GET_COLLABORATOR_PRODUCT_LIST),
            collaboratorProductData: result.responseData && result.responseData.data
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_COLLABORATOR_PRODUCT_LIST) });
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
        const apiParams = {
            ...apiConfig.collaboratorProduct.delete,
            path: `${apiConfig.collaboratorProduct.delete.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
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
    takeLatest(GET_COLLABORATOR_PRODUCT_BY_ID, getCollaboratorProductById),
    takeLatest(CREATE_COLLABORATOR_PRODUCT, createCollaboratorProduct),
    takeLatest(UPDATE_COLLABORATOR_PRODUCT, updateCollaboratorProduct),
    takeLatest(defineActionLoading(DELETE_COLLABORATOR_PRODUCT), deleteCollaboratorProduct),
]

export default sagas;