import React from 'react'
import { HourglassOutlined , SolutionOutlined, CarOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';

const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    contentRootUrl: `${process.env.REACT_APP_API}/v1/file/download`,
    langKey: 'vi'
};

export const APP = 'BACKEND_ADMIN'

const StorageKeys = {
    userData: 'nails-user-data'
}

const LayoutConfigs = {
    NAV_WIDTH_EXPANDED: 240,
    NAV_WIDTH_COLLAPSED: 80
}

const UserTypes = {
    ADMIN: 1,
    CUSTOMER: 2,
    EMPLOYEE: 3,
    COLLABORATOR: 4,
}

const GroupPermissonTypes = {
    ADMIN: 1,
    CUSTOMER: 2,
    EMPLOYEE: 3,
}

const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
}

const ProvinceKinds = {
    province: {
        name: 'PROVINCE_KIND_PROVINCE',
        level: 1,
        text: 'Tỉnh thành'
    },
    district: {
        name: 'PROVINCE_KIND_DISTRICT',
        level: 2,
        text: 'Quận/Huyện'
    },
    ward: {
        name: 'PROVINCE_KIND_WARD',
        level: 3,
        text: 'Phường/Xã'
    }
}

const CurrentcyPositions = {
    FRONT: 0,
    BACK: 1,
}

const OrdersStates = [
    {
        value: 0,
        label: 'Mới tạo',
        color: '#171717',
        icon: <HourglassOutlined />,
    },
    {
        value: 1,
        label: 'Đã duyệt',
        color: 'orange',
        icon: <SolutionOutlined />,
    },
    {
        value: 2,
        label: 'Vận chuyển',
        color: 'blue',
        icon: <CarOutlined />,
    },
    {
        value: 3,
        label: 'Hoàn tất',
        color: 'green',
        icon: <CheckCircleOutlined />,
    },
    {
        value: 4,
        label: 'Đã hủy',
        color: 'red',
        icon: <StopOutlined/>,
    },
]

export const LIMIT_IMAGE_SIZE = 512000;

// Pagination config
export const DEFAULT_TABLE_ITEM_SIZE = 10;
export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DATE_FORMAT_VALUE = 'DD/MM/YYYY';
export const TIME_FORMAT_DISPLAY = 'HH:mm';

// Common status
export const STATUS_INACTIVE = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_LOCK = -1;
export const STATUS_DELETE = -2;


export {
    AppConstants,
    StorageKeys,
    LayoutConfigs,
    UserTypes,
    GroupPermissonTypes,
    UploadFileTypes,
    ProvinceKinds,
    CurrentcyPositions,
    OrdersStates,
};
