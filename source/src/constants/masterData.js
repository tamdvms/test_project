import {
    STATUS_ACTIVE,
    STATUS_LOCK,
    GroupPermissonTypes,
} from './';

import React from 'react';
export const groupPermissionTypes = [
    { value: GroupPermissonTypes.ADMIN, label: 'Quản trị viên' },
    { value: GroupPermissonTypes.CUSTOMER, label: 'Khách hàng'}
]

export const commonStatus = [
    { value: STATUS_ACTIVE, label: 'Kích hoạt', color: 'green' },
    // { value: STATUS_INACTIVE, label: 'Inactive', color: 'warning' },
    { value: STATUS_LOCK, label: 'Đang khóa', color: 'red' },
]

export const commonLanguages = [
    { value: 'vi', label: 'Việt Nam'},
    { value: 'en', label: 'English'},
    { value: 'de', label: 'German'},
]

export const commonKinds = [
    { value: 1, label: 'Tin tức'},
    { value: 2, label: 'Dịch vụ'},
]

export const commonSex = [
    { value: 0, label: 'Nữ' },
    { value: 1, label: 'Nam' }
]

const GENDER_MALE = 1
const GENDER_FEMALE = 2
const GENDER_OTHER = 3

export const genders = [
    { value: GENDER_MALE, label: 'Nam' },
    { value: GENDER_FEMALE, label: 'Nữ' },
    { value: GENDER_OTHER, label: 'Khác' },
]

const CATEGORY_KIND_IMPORT = 1;
const CATEGORY_KIND_EXPORT = 2;
const CATEGORY_KIND_PRODUCT = 3;
const CATEGORY_KIND_COLLABORATOR = 4;

export const categoryKinds = {
    CATEGORY_KIND_EXPORT,
    CATEGORY_KIND_IMPORT,
    CATEGORY_KIND_PRODUCT,
    CATEGORY_KIND_COLLABORATOR,
}

export const IMPORT_EXPORT_KIND_IMPORT = 1;
export const IMPORT_EXPORT_KIND_EXPORT = 2;

export const COLLABORATOR_PRODUCT_KIND_MONEY = 1;
export const COLLABORATOR_PRODUCT_KIND_PERCENT = 2;