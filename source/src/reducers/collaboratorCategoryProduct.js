import { actionTypes, reduxUtil } from '../actions/collaboratorCategoryProduct';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_COLLABORATOR_CATEGORY_PRODUCT_LIST,
    DELETE_COLLABORATOR_CATEGORY_PRODUCT,
} = actionTypes;

const initialState = { 
    collaboratorCategoryProductData: {},
    tbCollaboratorCategoryProductLoading: false,
};

const reducer = createReducer({
        [defineActionLoading(GET_COLLABORATOR_CATEGORY_PRODUCT_LIST)]: (state) => {
            return {
                ...state,
                tbCollaboratorCategoryProductLoading: true
            }
        },
        [defineActionSuccess(GET_COLLABORATOR_CATEGORY_PRODUCT_LIST)]: (state, { collaboratorCategoryProductData }) => {
            return {
                ...state,
                collaboratorCategoryProductData,
                tbCollaboratorCategoryProductLoading: false
            }
        },
        [defineActionLoading(DELETE_COLLABORATOR_CATEGORY_PRODUCT)]: (state) => {
            return {
                ...state,
                tbCollaboratorCategoryProductLoading: true
            }
        },
        [defineActionFailed(DELETE_COLLABORATOR_CATEGORY_PRODUCT)] : (state) =>{
            return {
                ...state,
                tbCollaboratorCategoryProductLoading: false,
            }
        },
    },
    initialState
)

export default {
    reducer
};
