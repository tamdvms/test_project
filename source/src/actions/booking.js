import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('BOOKING');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_PRODUCT_AUTOCOMPLETE: defineAction('GET_PRODUCT_AUTOCOMPLETE'),
    GET_CUSTOMER_AUTOCOMPLETE: defineAction('GET_CUSTOMER_AUTOCOMPLETE'),
}

export const actions = {
    getProductAutoComplete: createAction(actionTypes.GET_PRODUCT_AUTOCOMPLETE),
    getCustomerAutoComplete: createAction(actionTypes.GET_CUSTOMER_AUTOCOMPLETE),
}