import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('COLLABORATOR');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_COLLABORATOR_LIST: defineAction('GET_COLLABORATOR_LIST'),
    GET_EMPLOYEE_COLLABORATOR_LIST: defineAction('GET_EMPLOYEE_COLLABORATOR_LIST'),
    GET_COLLABORATOR_BY_ID: defineAction('GET_COLLABORATOR_BY_ID'),
    CREATE_COLLABORATOR: defineAction('CREATE_COLLABORATOR'),
    UPDATE_COLLABORATOR: defineAction('UPDATE_COLLABORATOR'),
    DELETE_COLLABORATOR: defineAction('DELETE_COLLABORATOR'),
}

export const actions = {
    getCollaboratorList: createActionWithLoading(actionTypes.GET_COLLABORATOR_LIST),
    getEmployeeCollaboratorList: createActionWithLoading(actionTypes.GET_EMPLOYEE_COLLABORATOR_LIST),
    getCollaboratorById: createAction(actionTypes.GET_COLLABORATOR_BY_ID),
    createCollaborator: createAction(actionTypes.CREATE_COLLABORATOR),
    updateCollaborator: createAction(actionTypes.UPDATE_COLLABORATOR),
    deleteCollaborator: createActionWithLoading(actionTypes.DELETE_COLLABORATOR),
}