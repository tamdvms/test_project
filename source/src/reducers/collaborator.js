import { actionTypes, reduxUtil } from '../actions/collaborator';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_COLLABORATOR_LIST,
    DELETE_COLLABORATOR,
    GET_EMPLOYEE_COLLABORATOR_LIST,
} = actionTypes;

const initialState = { 
    collaboratorData: {},
    employeeCollaboratorData: {},
    tbCollaboratorLoading: false,
    tbEmployeeCollaboratorLoading: false,
};

const reducer = createReducer({
        [defineActionLoading(GET_COLLABORATOR_LIST)]: (state) => {
            return {
                ...state,
                tbCollaboratorLoading: true
            }
        },
        [defineActionSuccess(GET_COLLABORATOR_LIST)]: (state, { collaboratorData }) => {
            return {
                ...state,
                collaboratorData,
                tbCollaboratorLoading: false
            }
        },
        [defineActionLoading(DELETE_COLLABORATOR)]: (state) => {
            return {
                ...state,
                tbCollaboratorLoading: true
            }
        },
        [defineActionFailed(DELETE_COLLABORATOR)] : (state) =>{
            return {
                ...state,
                tbCollaboratorLoading: false,
            }
        },
        [defineActionLoading(GET_EMPLOYEE_COLLABORATOR_LIST)]: (state) => {
            return {
                ...state,
                tbEmployeeCollaboratorLoading: true
            }
        },
        [defineActionSuccess(GET_EMPLOYEE_COLLABORATOR_LIST)]: (state, { employeeCollaboratorData }) => {
            return {
                ...state,
                employeeCollaboratorData,
                tbEmployeeCollaboratorLoading: false
            }
        },
    },
    initialState
)

export default {
    reducer
};
