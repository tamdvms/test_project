import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('ORDERS');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_ORDERS_LIST: defineAction('GET_ORDERS_LIST'),
    GET_ORDERS_BY_ID: defineAction('GET_ORDERS_BY_ID'),
    UPDATE_ORDERS: defineAction('UPDATE_ORDERS'),
    CANCEL_ORDERS: defineAction('CANCEL_ORDERS'),
}

export const actions = {
    getOrdersList: createActionWithLoading(actionTypes.GET_ORDERS_LIST),
    getOrdersById: createAction(actionTypes.GET_ORDERS_BY_ID),
    updateOrders: createAction(actionTypes.UPDATE_ORDERS),
    cancelOrders: createAction(actionTypes.CANCEL_ORDERS),
}