import { combineReducers } from 'redux';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import settings from './setting';

const rootReducer = combineReducers({
    appCommon: appCommon.reducer,
    account: account.reducer,
    user: user.reducer,

    groupPermission: groupPermission.reducer,
    settings: settings.reducer,
});

export default rootReducer;