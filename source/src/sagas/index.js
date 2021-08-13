import { all } from 'redux-saga/effects';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import setting from './setting';
import customer from './customer';
import category from './category';
import product from './product';
import importManagement from './importManagement';
import exportManagement from './exportManagement';
import employee from './employee';
import booking from './booking';
import orders from './orders';

const sagas = [
    ...appCommon,
    ...account,
    ...user,
    ...groupPermission,
    ...setting,
    ...customer,
    ...category,
    ...product,
    ...importManagement,
    ...exportManagement,
    ...employee,
    ...booking,
    ...orders,
];

function* rootSaga() {
    yield all(sagas);
}

export default rootSaga;
