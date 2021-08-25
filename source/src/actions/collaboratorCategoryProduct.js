import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('COLLABORATOR_CATEGORY_PRODUCT');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_COLLABORATOR_CATEGORY_PRODUCT_LIST: defineAction('GET_COLLABORATOR_CATEGORY_PRODUCT_LIST'),
    GET_COLLABORATOR_CATEGORY_PRODUCT_BY_ID: defineAction('GET_COLLABORATOR_CATEGORY_PRODUCT_BY_ID'),
    CREATE_COLLABORATOR_CATEGORY_PRODUCT: defineAction('CREATE_COLLABORATOR_CATEGORY_PRODUCT'),
    UPDATE_COLLABORATOR_CATEGORY_PRODUCT: defineAction('UPDATE_COLLABORATOR_CATEGORY_PRODUCT'),
    DELETE_COLLABORATOR_CATEGORY_PRODUCT: defineAction('DELETE_COLLABORATOR_CATEGORY_PRODUCT'),
}

export const actions = {
    getCollaboratorCategoryProductList: createActionWithLoading(actionTypes.GET_COLLABORATOR_CATEGORY_PRODUCT_LIST),
    getCollaboratorCategoryProductById: createAction(actionTypes.GET_COLLABORATOR_CATEGORY_PRODUCT_BY_ID),
    createCollaboratorCategoryProduct: createAction(actionTypes.CREATE_COLLABORATOR_CATEGORY_PRODUCT),
    updateCollaboratorCategoryProduct: createAction(actionTypes.UPDATE_COLLABORATOR_CATEGORY_PRODUCT),
    deleteCollaboratorCategoryProduct: createActionWithLoading(actionTypes.DELETE_COLLABORATOR_CATEGORY_PRODUCT),
}