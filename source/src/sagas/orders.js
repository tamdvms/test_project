import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/orders';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_ORDERS_LIST,
    GET_ORDERS_BY_ID,
    UPDATE_ORDERS,
    UPDATE_STATE_ORDERS,
    CANCEL_ORDERS,
} = actionTypes;


function* getOrdersList({ payload: { params, onCompleted } }) {

    const apiParams = apiConfig.orders.getList;
    const searchParams = { page: params.page, size: params.size };

    if(params.collaboratorId) {
        searchParams.collaboratorId = params.collaboratorId
    }

    if(params.search) {
        if(params.search.employeeFullName) {
            searchParams.employeeFullName = params.search.employeeFullName
        }
        if(params.search.state) {
            searchParams.state = params.search.state
        }
        if(params.search.code) {
            searchParams.code = params.search.code
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        onCompleted && onCompleted(result.responseData.data?.data)
        yield put({
            type: defineActionSuccess(GET_ORDERS_LIST),
            ordersData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        console.error(error.message)
        yield put({ type: defineActionFailed(GET_ORDERS_LIST) });
    }
}

function* getOrdersById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.orders.getById,
            path: `${apiConfig.orders.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateStateOrders({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.orders.updateState;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateOrders({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.orders.update;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* cancelOrders({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.orders.cancelOrders;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_ORDERS_LIST), getOrdersList),
    takeLatest(GET_ORDERS_BY_ID, getOrdersById),
    takeLatest(UPDATE_STATE_ORDERS, updateStateOrders),
    takeLatest(UPDATE_ORDERS, updateOrders),
    takeLatest(CANCEL_ORDERS, cancelOrders),
]

export default sagas;