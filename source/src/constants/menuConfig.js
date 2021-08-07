import React from 'react';

import {
    UsergroupAddOutlined,
    ControlOutlined,
    FileTextOutlined,
    UserOutlined,
    QuestionOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import { sitePathConfig } from '../constants/sitePathConfig';
const navMenuConfig = [
    {
        label: 'Quản lý tài khoản',
        icon: <UsergroupAddOutlined />,
        children: [
            {
                label: 'Quản trị viên',
                ...sitePathConfig.admin
            },
        ]
    },
    {
        label: 'Hệ thống',
        icon: <ControlOutlined />,
        children: [
            {
                label: 'Cài Đặt',
                ...sitePathConfig.setting
            },
            {
                label: 'Quyền',
                ...sitePathConfig.groupPermission
            },
        ]
    },
    {
        label: 'Khách hàng',
        icon: <UserOutlined />,
        children: [
            {
                label: 'Khách hàng',
                ...sitePathConfig.customer,
            }
        ]
    },
    {
        label: 'Danh mục',
        icon: <UnorderedListOutlined />,
        children: [
            {
                label: 'Danh mục thu',
                ...sitePathConfig.categoryImport,
            },
            {
                label: 'Danh mục chi',
                ...sitePathConfig.categoryExport,
            },
            {
                label: 'Danh mục sản phẩm',
                ...sitePathConfig.categoryProduct,
            },
        ]
    },
]

export { navMenuConfig };
