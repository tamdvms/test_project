import {actionTypes, reduxUtil} from "../actions/exportManagement";


const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;

const {
    GET_EXPORT_MANAGEMENT_LIST,
    DELETE_EXPORT_MANAGEMENT,
    GET_CATEGORY_AUTOCOMPLETE_EXPORT,
} = actionTypes;

const initialState = {
    exportManagementListData: {},
    exportManagementListLoading: false,
    categoryAutoComplete: {}
}

const reducer = createReducer ({
    [defineActionLoading(GET_EXPORT_MANAGEMENT_LIST)] : (state) =>{
        return {
            ...state,
            exportManagementListLoading: true,
        }
    },
    [defineActionSuccess(GET_EXPORT_MANAGEMENT_LIST)] : (state, {exportManagementListData} ) =>{
        return {
            ...state,
            exportManagementListData,
            exportManagementListLoading: false,
        }
    },
    [defineActionFailed(GET_EXPORT_MANAGEMENT_LIST)] : (state) =>{
        return {
            ...state,
            exportManagementListLoading: false,
        }
    },
    [defineActionLoading(DELETE_EXPORT_MANAGEMENT)] : (state) =>{
        return {
            ...state,
            exportManagementListLoading: true,
        }
    },
    [defineActionFailed(DELETE_EXPORT_MANAGEMENT)] : (state) =>{
        return {
            ...state,
            exportManagementListLoading: false,
        }
    },
    [defineActionSuccess(GET_CATEGORY_AUTOCOMPLETE_EXPORT)] : (state, {categoryAutoComplete} ) =>{
        return {
            ...state,
            categoryAutoComplete,
        }
    },
    initialState
})

export default {
    reducer
};