import { actionTypes, reduxUtil } from '../actions/orders';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_ORDERS_LIST,
    GET_COLLABORATOR_ORDERS_LIST,
} = actionTypes;

const initialState = {
    ordersData: {},
    tbOrdersLoading: false,
    collaboratorOrdersData: {},
    tbCollaboratorOrdersLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_ORDERS_LIST)]: (state) => {
        return {
            ...state,
            tbOrdersLoading: true
        }
    },
    [defineActionSuccess(GET_ORDERS_LIST)]: (state, { ordersData }) => {
        return {
            ...state,
            ordersData,
            tbOrdersLoading: false
        }
    },
    [defineActionLoading(GET_COLLABORATOR_ORDERS_LIST)]: (state) => {
        return {
            ...state,
            tbCollaboratorOrdersLoading: true
        }
    },
    [defineActionSuccess(GET_COLLABORATOR_ORDERS_LIST)]: (state, { collaboratorOrdersData }) => {
        return {
            ...state,
            collaboratorOrdersData,
            tbCollaboratorOrdersLoading: false
        }
    },
    initialState
})

export default {
    reducer
};
