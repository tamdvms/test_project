import { actionTypes, reduxUtil } from '../actions/collaboratorProduct';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_COLLABORATOR_PRODUCT_LIST,
    DELETE_COLLABORATOR_PRODUCT,
} = actionTypes;

const initialState = { 
    collaboratorProductData: {},
    tbCollaboratorProductLoading: false,
};

const reducer = createReducer({
        [defineActionLoading(GET_COLLABORATOR_PRODUCT_LIST)]: (state) => {
            return {
                ...state,
                tbCollaboratorProductLoading: true
            }
        },
        [defineActionSuccess(GET_COLLABORATOR_PRODUCT_LIST)]: (state, { collaboratorProductData }) => {
            return {
                ...state,
                collaboratorProductData,
                tbCollaboratorProductLoading: false
            }
        },
        [defineActionLoading(DELETE_COLLABORATOR_PRODUCT)]: (state) => {
            return {
                ...state,
                tbCollaboratorProductLoading: true
            }
        },
        [defineActionFailed(DELETE_COLLABORATOR_PRODUCT)] : (state) =>{
            return {
                ...state,
                tbCollaboratorProductLoading: false,
            }
        },
    },
    initialState
)

export default {
    reducer
};
