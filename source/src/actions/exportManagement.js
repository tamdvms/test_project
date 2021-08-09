import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('EXPORT_MANAGEMENT');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_EXPORT_MANAGEMENT_LIST: defineAction('GET_EXPORT_MANAGEMENT_LIST'),
    GET_EXPORT_MANAGEMENT_BY_ID: defineAction('GET_EXPORT_MANAGEMENT_BY_ID'),
    CREATE_EXPORT_MANAGEMENT: defineAction('CREATE_EXPORT_MANAGEMENT'),
    UPDATE_EXPORT_MANAGEMENT: defineAction('UPDATE_EXPORT_MANAGEMENT'),
    DELETE_EXPORT_MANAGEMENT: defineAction('DELETE_EXPORT_MANAGEMENT'),
    GET_CATEGORY_AUTOCOMPLETE_EXPORT: defineAction('GET_CATEGORY_AUTOCOMPLETE_EXPORT'),
}

export const actions = {
    getExportManagementList: createActionWithLoading(actionTypes.GET_EXPORT_MANAGEMENT_LIST),
    getExportManagementById: createAction(actionTypes.GET_EXPORT_MANAGEMENT_BY_ID),
    createExportManagement: createAction(actionTypes.CREATE_EXPORT_MANAGEMENT),
    updateExportManagement: createAction(actionTypes.UPDATE_EXPORT_MANAGEMENT),
    deleteExportManagement: createActionWithLoading(actionTypes.DELETE_EXPORT_MANAGEMENT),
    getCategoryAutoCompleteExport: createAction(actionTypes.GET_CATEGORY_AUTOCOMPLETE_EXPORT),
}