import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/booking';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_PRODUCT_AUTOCOMPLETE,
} = actionTypes;


function* getProductAutoComplete({ payload: { params, onCompleted } }) {
    try {
        const { responseData, success } = yield call(sendRequest, apiConfig.booking.getProductAutoComplete, params);
        if(success && responseData.result) {
            onCompleted && onCompleted(responseData.data?.data || [])
        }
    }
    catch(error) {
    }
}

const sagas = [
    takeLatest(GET_PRODUCT_AUTOCOMPLETE, getProductAutoComplete),
]

export default sagas;