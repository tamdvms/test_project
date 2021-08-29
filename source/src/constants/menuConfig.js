import React from 'react';

import {
    UsergroupAddOutlined,
    ControlOutlined,
    FileTextOutlined,
    UserOutlined,
    QuestionOutlined,
    UnorderedListOutlined,
    InboxOutlined,
    UserAddOutlined,
    ShoppingCartOutlined,
    CarryOutOutlined,
} from '@ant-design/icons';
import { sitePathConfig } from '../constants/sitePathConfig';
import store from '../store';
import { actions } from "../actions";
import { categoryKinds } from './masterData';
import qs from 'query-string';
import { showErrorMessage } from '../services/notifyService';

const { CATEGORY_KIND_PRODUCT } = categoryKinds;
const strParams = params => {
    return qs.stringify(params)
}

const navMenuConfig = [
    {
        label: 'Account Management',
        icon: <UsergroupAddOutlined />,
        children: [
            {
                label: 'Admin',
                ...sitePathConfig.admin
            },
            {
                label: 'Employee',
                ...sitePathConfig.employee
            },
        ]
    },
    {
        label: 'System',
        icon: <ControlOutlined />,
        children: [
            {
                label: 'Setting',
                ...sitePathConfig.setting
            },
            {
                label: 'Role',
                ...sitePathConfig.groupPermission
            },
        ]
    },
    {
        label: 'Customer',
        icon: <UserOutlined />,
        children: [
            {
                label: 'Customer',
                ...sitePathConfig.customer,
            }
        ]
    },
    {
        label: 'Category',
        icon: <UnorderedListOutlined />,
        children: [
            {
                label: 'CategoryImport',
                ...sitePathConfig.categoryImport,
            },
            {
                label: 'CategoryExport',
                ...sitePathConfig.categoryExport,
            },
            {
                label: 'CategoryProduct',
                ...sitePathConfig.categoryProduct,
            },
        ]
    },
    {
        label: 'Product',
        icon: <InboxOutlined />,
        ...sitePathConfig.product,
        children: [],
        handleOnClick(props, handleLoadingMenuItem) {
            !this.clicked
            && handleLoadingMenuItem(sitePathConfig.product.path)
            && store.dispatch(
                actions.getProductCategoryAutoComplete({
                    params: { kind: CATEGORY_KIND_PRODUCT },
                    onCompleted: data => {
                        if (data?.length > 0) {
                            const pathname = sitePathConfig.product.path;
                            data.forEach(c => {
                                const _pathname = `${pathname}/${c.id}`
                                const _pathnameWithQs = `${pathname}/${c.id}?${strParams({ categoryId: c.id, categoryName: c.categoryName })}`
                                this.children.push({
                                    label: c.categoryName,
                                    path: _pathnameWithQs,
                                    key: _pathname,
                                    childrenKeys: this.childrenKeys
                                })
                            })
                        }
                        handleLoadingMenuItem(null)
                    },
                    onError: error => {
                        handleLoadingMenuItem(null)
                        showErrorMessage(
                            error?.message ||
                                props.t('errorMessage')
                        )
                    },
                })
            )
            this.clicked = true;
        },
    },
    {
        label: 'Selling',
        icon: <ShoppingCartOutlined />,
        children: [
            {
                label: 'Booking',
                ...sitePathConfig.booking
            },
            {
                label: 'Orders Management',
                ...sitePathConfig.orders
            },
        ]
    },
    {
        label: 'Selling Management',
        icon: <CarryOutOutlined />,
        children: [
            {
                label: 'Import Management',
                ...sitePathConfig.importManagement
            },
            {
                label: 'Export Management',
                ...sitePathConfig.exportManagement
            },
        ]
    },
    {
        label: 'Collaborator Management',
        icon: <UserAddOutlined />,
        children: [
            {
                label: 'Collaborator Category',
                ...sitePathConfig.collaboratorCategory
            },
            {
                label: 'Collaborator Management',
                ...sitePathConfig.employeeCollaborator
            },
        ]
    },
]

export { navMenuConfig };
