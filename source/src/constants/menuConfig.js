import React from 'react';

import { UsergroupAddOutlined, ControlOutlined, FileTextOutlined, UserOutlined, QuestionOutlined } from '@ant-design/icons';
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
]

export { navMenuConfig };
