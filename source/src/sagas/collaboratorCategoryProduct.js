import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/collaboratorCategoryProduct';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';
import { UserTypes } from '../constants';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_COLLABORATOR_CATEGORY_PRODUCT_LIST,
    GET_COLLABORATOR_CATEGORY_PRODUCT_BY_ID,
    CREATE_COLLABORATOR_CATEGORY_PRODUCT,
    UPDATE_COLLABORATOR_CATEGORY_PRODUCT,
    DELETE_COLLABORATOR_CATEGORY_PRODUCT,
} = actionTypes;


function* getCollaboratorCategoryProductList({ payload: { params, onCompleted } }) {

    const apiParams = apiConfig.collaboratorCategoryProduct.getList;
    const searchParams = { };

    if(params.collaboratorProductId) {
        searchParams.collaboratorProductId = params.collaboratorProductId;
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
            type: defineActionSuccess(GET_COLLABORATOR_CATEGORY_PRODUCT_LIST),
            collaboratorCategoryProductData: result.responseData && result.responseData.data
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_COLLABORATOR_CATEGORY_PRODUCT_LIST) });
    }
}

function* getCollaboratorCategoryProductById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.collaboratorCategoryProduct.getById,
            path: `${apiConfig.collaboratorCategoryProduct.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createCollaboratorCategoryProduct({ payload: { params, onCompleted, onError } }) {

    try {
        const result = yield call(sendRequest, apiConfig.collaboratorCategoryProduct.create, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateCollaboratorCategoryProduct({ payload: { params, onCompleted, onError } }) {
    try {
        const result = yield call(sendRequest, apiConfig.collaboratorCategoryProduct.update, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteCollaboratorCategoryProduct({ payload: { params, onCompleted, onError } }) {
    try {
        const result = yield call(sendRequest, apiConfig.collaboratorCategoryProduct.delete, params);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_COLLABORATOR_CATEGORY_PRODUCT) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_COLLABORATOR_CATEGORY_PRODUCT) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_COLLABORATOR_CATEGORY_PRODUCT_LIST), getCollaboratorCategoryProductList),
    takeLatest(GET_COLLABORATOR_CATEGORY_PRODUCT_BY_ID, getCollaboratorCategoryProductById),
    takeLatest(CREATE_COLLABORATOR_CATEGORY_PRODUCT, createCollaboratorCategoryProduct),
    takeLatest(UPDATE_COLLABORATOR_CATEGORY_PRODUCT, updateCollaboratorCategoryProduct),
    takeLatest(defineActionLoading(DELETE_COLLABORATOR_CATEGORY_PRODUCT), deleteCollaboratorCategoryProduct),
]

export default sagas;