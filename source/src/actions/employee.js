import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('EMPLOYEE');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_EMPLOYEE_LIST: defineAction('GET_EMPLOYEE_LIST'),
    GET_EMPLOYEE_BY_ID: defineAction('GET_EMPLOYEE_BY_ID'),
    CREATE_EMPLOYEE: defineAction('CREATE_EMPLOYEE'),
    UPDATE_EMPLOYEE: defineAction('UPDATE_EMPLOYEE'),
    DELETE_EMPLOYEE: defineAction('DELETE_EMPLOYEE'),
}

export const actions = {
    getEmployeeList: createActionWithLoading(actionTypes.GET_EMPLOYEE_LIST),
    getEmployeeById: createAction(actionTypes.GET_EMPLOYEE_BY_ID),
    createEmployee: createAction(actionTypes.CREATE_EMPLOYEE),
    updateEmployee: createAction(actionTypes.UPDATE_EMPLOYEE),
    deleteEmployee: createActionWithLoading(actionTypes.DELETE_EMPLOYEE),
}