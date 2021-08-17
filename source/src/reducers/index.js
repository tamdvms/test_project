import { combineReducers } from 'redux';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import settings from './setting';
import customer from './customer';
import category from './category';
import product from './product';
import importManagement from './importManagement';
import exportManagement from './exportManagement';
import employee from './employee';
import orders from './orders';
import collaborator from './collaborator';

const rootReducer = combineReducers({
    appCommon: appCommon.reducer,
    account: account.reducer,
    user: user.reducer,
    groupPermission: groupPermission.reducer,
    settings: settings.reducer,
    customer: customer.reducer,
    category: category.reducer,
    product: product.reducer,
    importManagement: importManagement.reducer,
    exportManagement: exportManagement.reducer,
    employee: employee.reducer,
    orders: orders.reducer,
    collaborator: collaborator.reducer,
});

export default rootReducer;