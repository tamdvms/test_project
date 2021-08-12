import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/booking';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_PRODUCT_AUTOCOMPLETE,
    GET_CUSTOMER_AUTOCOMPLETE,
} = actionTypes;


function* getProductAutoComplete({ payload: { params, onCompleted, defaultItemSize } }) {
    try {
        const { responseData, success } = yield call(sendRequest, apiConfig.booking.getProductAutoComplete, params);
        if(success && responseData.result) {
            const totalElements = responseData.data?.totalElements;
            onCompleted && onCompleted(responseData.data?.data || [], {
                numLoadMore: totalElements - params.size > defaultItemSize ? defaultItemSize : totalElements - params.size,
                size: params.size
            })
        }
    }
    catch(error) {
    }
}

function* getCustomerAutoComplete({ payload: { params, onCompleted, onDone } }) {
    try {
        const { responseData, success } = yield call(sendRequest, apiConfig.booking.getCustomerAutoComplete, params);
        if(success && responseData.result) {
            onCompleted && onCompleted(responseData.data?.data || [])
        }
    }
    catch(error) {
    }
    finally {
        onDone && onDone()
    }
}

const sagas = [
    takeLatest(GET_PRODUCT_AUTOCOMPLETE, getProductAutoComplete),
    takeLatest(GET_CUSTOMER_AUTOCOMPLETE, getCustomerAutoComplete),
]

export default sagas;