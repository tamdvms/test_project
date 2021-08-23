import { actions as appCommonActions, actionTypes as appCommonTypes } from './appCommon';
import { actions as accountActions, actionTypes as accountTypes } from './account';
import { actions as userActions, actionTypes as userTypes } from './user';
import { actions as groupPermissionActions, actionTypes as groupPermissionTypes } from './groupPermission';
import {actions as settingActions, actionTypes as settingTypes} from './setting';
import {actions as customerActions, actionTypes as customerTypes} from './customer';
import {actions as categoryActions, actionTypes as categoryTypes} from './category';
import {actions as productActions, actionTypes as productTypes} from './product';
import {actions as importManagementActions, actionTypes as importManagementActionsTypes} from "./importManagement";
import {actions as exportManagementActions, actionTypes as exportManagementActionsTypes} from "./exportManagement";
import {actions as employeeActions, actionTypes as employeeActionsTypes} from "./employee";
import {actions as bookingActions, actionTypes as bookingActionsTypes} from "./booking";
import {actions as ordersActions, actionTypes as ordersActionsTypes} from "./orders";
import {actions as collaboratorActions, actionTypes as collaboratorActionsTypes} from "./collaborator";
import {actions as collaboratorProductActions, actionTypes as collaboratorProductActionsTypes} from "./collaboratorProduct";

export const actions = {
    ...appCommonActions,
    ...accountActions,
    ...userActions,
    ...groupPermissionActions,
    ...settingActions,
    ...customerActions,
    ...categoryActions,
    ...productActions,
    ...importManagementActions,
    ...exportManagementActions,
    ...employeeActions,
    ...bookingActions,
    ...ordersActions,
    ...collaboratorActions,
    ...collaboratorProductActions,
}

export const types = {
    ...appCommonTypes,
    ...accountTypes,
    ...userTypes,
    ...groupPermissionTypes,
    ...settingTypes,
    ...customerTypes,
    ...categoryTypes,
    ...productTypes,
    ...importManagementActionsTypes,
    ...exportManagementActionsTypes,
    ...employeeActionsTypes,
    ...bookingActionsTypes,
    ...ordersActionsTypes,
    ...collaboratorActionsTypes,
    ...collaboratorProductActionsTypes,
}