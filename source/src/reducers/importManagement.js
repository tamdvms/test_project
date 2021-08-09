import {actionTypes, reduxUtil} from "../actions/importManagement";


const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;

const {
    GET_IMPORT_MANAGEMENT_LIST,
    DELETE_IMPORT_MANAGEMENT,
    GET_CATEGORY_AUTOCOMPLETE,
} = actionTypes;

const initialState = {
    importManagementListData: {},
    importManagementListLoading: false,
    categoryAutoComplete: {},
}

const reducer = createReducer ({
    [defineActionLoading(GET_IMPORT_MANAGEMENT_LIST)] : (state) =>{
        return {
            ...state,
            importManagementListLoading: true,
        }
    },
    [defineActionSuccess(GET_IMPORT_MANAGEMENT_LIST)] : (state, {importManagementListData} ) =>{
        return {
            ...state,
            importManagementListData,
            importManagementListLoading: false,
        }
    },
    [defineActionFailed(GET_IMPORT_MANAGEMENT_LIST)] : (state) =>{
        return {
            ...state,
            importManagementListLoading: false,
        }
    },
    [defineActionLoading(DELETE_IMPORT_MANAGEMENT)] : (state) =>{
        return {
            ...state,
            importManagementListLoading: true,
        }
    },
    [defineActionFailed(DELETE_IMPORT_MANAGEMENT)] : (state) =>{
        return {
            ...state,
            importManagementListLoading: false,
        }
    },
    [defineActionSuccess(GET_CATEGORY_AUTOCOMPLETE)] : (state, {categoryAutoComplete} ) =>{
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