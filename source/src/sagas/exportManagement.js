import { call, put, takeLatest } from "redux-saga/effects";
import {actionTypes, reduxUtil } from "../actions/exportManagement";

import apiConfig from "../constants/apiConfig";

import { sendRequest } from "../services/apiService";
import { handleApiResponse } from "../utils/apiHelper";
const {defineActionLoading, defineActionSuccess, defineActionFailed} = reduxUtil;

const {
    GET_EXPORT_MANAGEMENT_LIST,
    DELETE_EXPORT_MANAGEMENT,
    GET_EXPORT_MANAGEMENT_BY_ID,
    UPDATE_EXPORT_MANAGEMENT,
    CREATE_EXPORT_MANAGEMENT,
    GET_CATEGORY_AUTOCOMPLETE_EXPORT,
} = actionTypes;

function* getExportManagementList({ payload: {params} }){
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
            type: defineActionSuccess(GET_EXPORT_MANAGEMENT_LIST),
            exportManagementListData: result.responseData && result.responseData.data,
        })
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_EXPORT_MANAGEMENT_LIST) });
    }
}

function* getExportManagement ({payload:{params, onCompleted, onError}})
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

function* createExportManagement({payload: {params, onCompleted, onError}})
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

function* updateExportManagement({payload: {params, onCompleted, onError}})
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

function* deleteExportManagement({payload: {params, onCompleted, onError}})
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
            yield put({ type: defineActionFailed(DELETE_EXPORT_MANAGEMENT) });
    }
    catch(error)
    {
        yield put({ type: defineActionFailed(DELETE_EXPORT_MANAGEMENT) });
        onError(error);
    }
}

function* getCategoryAutoComplete({ payload: {params, onCompleted, onError } }){
    const searchParams = { kind: params.kind };

    try {
        const result = yield call (sendRequest, apiConfig.importExportManagement.getCategoryAutoComplete, searchParams);
        yield put ({
            type: defineActionSuccess(GET_CATEGORY_AUTOCOMPLETE_EXPORT),
            categoryAutoComplete: result.responseData && result.responseData.data,
        })
        onCompleted && onCompleted();
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_CATEGORY_AUTOCOMPLETE_EXPORT) });
        onError && onError()
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_EXPORT_MANAGEMENT_LIST), getExportManagementList),
    takeLatest(GET_EXPORT_MANAGEMENT_BY_ID, getExportManagement),
    takeLatest(CREATE_EXPORT_MANAGEMENT, createExportManagement),
    takeLatest(UPDATE_EXPORT_MANAGEMENT, updateExportManagement),
    takeLatest(defineActionLoading(DELETE_EXPORT_MANAGEMENT), deleteExportManagement),
    takeLatest(GET_CATEGORY_AUTOCOMPLETE_EXPORT, getCategoryAutoComplete),
]

export default sagas;