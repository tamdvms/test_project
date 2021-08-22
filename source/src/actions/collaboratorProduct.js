import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('COLLABORATOR_PRODUCT');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_COLLABORATOR_PRODUCT_LIST: defineAction('GET_COLLABORATOR_PRODUCT_LIST'),
    GET_COLLABORATOR_PRODUCT_BY_ID: defineAction('GET_COLLABORATOR_PRODUCT_BY_ID'),
    CREATE_COLLABORATOR_PRODUCT: defineAction('CREATE_COLLABORATOR_PRODUCT'),
    UPDATE_COLLABORATOR_PRODUCT: defineAction('UPDATE_COLLABORATOR_PRODUCT'),
    DELETE_COLLABORATOR_PRODUCT: defineAction('DELETE_COLLABORATOR_PRODUCT'),
}

export const actions = {
    getCollaboratorProductList: createActionWithLoading(actionTypes.GET_COLLABORATOR_PRODUCT_LIST),
    getCollaboratorProductById: createAction(actionTypes.GET_COLLABORATOR_PRODUCT_BY_ID),
    createCollaboratorProduct: createAction(actionTypes.CREATE_COLLABORATOR_PRODUCT),
    updateCollaboratorProduct: createAction(actionTypes.UPDATE_COLLABORATOR_PRODUCT),
    deleteCollaboratorProduct: createActionWithLoading(actionTypes.DELETE_COLLABORATOR_PRODUCT),
}