import { call, put, takeLatest } from "redux-saga/effects";
import {actionTypes, reduxUtil } from "../actions/importManagement";

import apiConfig from "../constants/apiConfig";

import { sendRequest } from "../services/apiService";
import { handleApiResponse } from "../utils/apiHelper";
const {defineActionLoading, defineActionSuccess, defineActionFailed} = reduxUtil;

const {
    GET_IMPORT_MANAGEMENT_LIST,
    DELETE_IMPORT_MANAGEMENT,
    GET_IMPORT_MANAGEMENT_BY_ID,
    UPDATE_IMPORT_MANAGEMENT,
    CREATE_IMPORT_MANAGEMENT,
    GET_CATEGORY_AUTOCOMPLETE,
} = actionTypes;

function* getImportManagementList({ payload: {params} }){
    const apiParams = apiConfig.importExportManagement.getList;
    const searchParams = { page: params.page, size: params.size };
    
    if (params.search)
    {
        if(params.search.code)
            searchParams.code = params.search.code;
        if(params.search.status)
            searchParams.status = params.search.status;
        if(params.search.categoryId)
            searchParams.categoryId = params.search.categoryId;
        if(params.search.fromDateToDate) {
            searchParams.from = params.search.fromDateToDate[0];
            searchParams.to = params.search.fromDateToDate[1];
        }
        if(params.search.kind || params.search.kind === 0)
            searchParams.kind = params.search.kind;
    }

    try {
        const result = yield call (sendRequest, apiParams, searchParams);
        yield put ({
            type: defineActionSuccess(GET_IMPORT_MANAGEMENT_LIST),
            importManagementListData: result.responseData && result.responseData.data,
        })
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_IMPORT_MANAGEMENT_LIST) });
    }
}

function* getImportManagement ({payload:{params, onCompleted, onError}})
{
    try {
        //Define which Api and its path
        const apiParams = {
            ...apiConfig.importExportManagement.getById,
            path: `${apiConfig.importExportManagement.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error)
    {
        onError(error);
    }
}

function* createImportManagement({payload: {params, onCompleted, onError}})
{
    try{
        const result = yield call (sendRequest, apiConfig.importExportManagement.create, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error)
    {
        onError(error);
    }
}

function* updateImportManagement({payload: {params, onCompleted, onError}})
{
    try{
        const result = yield call (sendRequest, apiConfig.importExportManagement.update, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error)
    {
        onError(error);
    }
}

function* deleteImportManagement({payload: {params, onCompleted, onError}})
{
    try{
        const apiParams = {
            ...apiConfig.importExportManagement.delete,
            path: `${apiConfig.importExportManagement.delete.path}/${params.id}`
        }
        const result = yield call (sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_IMPORT_MANAGEMENT) });
    }
    catch(error)
    {
        yield put({ type: defineActionFailed(DELETE_IMPORT_MANAGEMENT) });
        onError(error);
    }
}

function* getCategoryAutoComplete({ payload: {params, onCompleted, onError } }){
    const searchParams = { kind: params.kind };

    try {
        const result = yield call (sendRequest, apiConfig.importExportManagement.getCategoryAutoComplete, searchParams);
        yield put ({
            type: defineActionSuccess(GET_CATEGORY_AUTOCOMPLETE),
            categoryAutoComplete: result.responseData && result.responseData.data,
        })
        onCompleted && onCompleted();
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_CATEGORY_AUTOCOMPLETE) });
        onError && onError()
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_IMPORT_MANAGEMENT_LIST), getImportManagementList),
    takeLatest(GET_IMPORT_MANAGEMENT_BY_ID, getImportManagement),
    takeLatest(CREATE_IMPORT_MANAGEMENT, createImportManagement),
    takeLatest(UPDATE_IMPORT_MANAGEMENT, updateImportManagement),
    takeLatest(defineActionLoading(DELETE_IMPORT_MANAGEMENT), deleteImportManagement),
    takeLatest(GET_CATEGORY_AUTOCOMPLETE, getCategoryAutoComplete),
]

export default sagas;