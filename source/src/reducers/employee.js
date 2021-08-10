import { actionTypes, reduxUtil } from '../actions/employee';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_EMPLOYEE_LIST,
    DELETE_EMPLOYEE,
} = actionTypes;

const initialState = { 
    employeeData: {},
    tbEmployeeLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_EMPLOYEE_LIST)]: (state) => {
        return {
            ...state,
            tbEmployeeLoading: true
        }
    },
    [defineActionSuccess(GET_EMPLOYEE_LIST)]: (state, { employeeData }) => {
        return {
            ...state,
            employeeData,
            tbEmployeeLoading: false
        }
    },
    [defineActionLoading(DELETE_EMPLOYEE)]: (state) => {
        return {
            ...state,
            tbEmployeeLoading: true
        }
    },
    [defineActionFailed(DELETE_EMPLOYEE)] : (state) =>{
        return {
            ...state,
            tbEmployeeLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
