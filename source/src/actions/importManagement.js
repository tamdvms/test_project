import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('IMPORT_MANAGEMENT');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_IMPORT_MANAGEMENT_LIST: defineAction('GET_IMPORT_MANAGEMENT_LIST'),
    GET_IMPORT_MANAGEMENT_BY_ID: defineAction('GET_IMPORT_MANAGEMENT_BY_ID'),
    CREATE_IMPORT_MANAGEMENT: defineAction('CREATE_IMPORT_MANAGEMENT'),
    UPDATE_IMPORT_MANAGEMENT: defineAction('UPDATE_IMPORT_MANAGEMENT'),
    DELETE_IMPORT_MANAGEMENT: defineAction('DELETE_IMPORT_MANAGEMENT'),
    GET_CATEGORY_AUTOCOMPLETE: defineAction('GET_CATEGORY_AUTOCOMPLETE'),
}

export const actions = {
    getImportManagementList: createActionWithLoading(actionTypes.GET_IMPORT_MANAGEMENT_LIST),
    getImportManagementById: createAction(actionTypes.GET_IMPORT_MANAGEMENT_BY_ID),
    createImportManagement: createAction(actionTypes.CREATE_IMPORT_MANAGEMENT),
    updateImportManagement: createAction(actionTypes.UPDATE_IMPORT_MANAGEMENT),
    deleteImportManagement: createActionWithLoading(actionTypes.DELETE_IMPORT_MANAGEMENT),
    getCategoryAutoCompleteImport: createAction(actionTypes.GET_CATEGORY_AUTOCOMPLETE),
}