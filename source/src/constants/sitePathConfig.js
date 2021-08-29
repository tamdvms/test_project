import apiConfig from './apiConfig';
import { actions } from '../actions';

export const sitePathConfig = {
    login: {
        path: '/login'
    },
    profile: {
        path: '/profile'
    },
    admin: {
        path: '/admins',
        permissions: [
            apiConfig.user.getAdminList.path,
            apiConfig.user.getAdminById.path,
            apiConfig.user.createAdmin.path,
            apiConfig.user.updateAdmin.path,
            apiConfig.user.deleteAdmin.path
        ]
    },
    forbidden: {
        path: '/forbidden'
    },
    setting: {
        path: '/settings',
        permissions: [
            apiConfig.setting.getSettingsList.path,
            apiConfig.setting.getSettingById.path,
            apiConfig.setting.createSetting.path,
            apiConfig.setting.updateSetting.path,
            apiConfig.setting.deleteSetting.path,
        ]
    },
    groupPermission: {
        path: '/groupPermission',
        permissions: [
            apiConfig.groupPermission.getList.path,
            apiConfig.groupPermission.getById.path,
            apiConfig.groupPermission.create.path,
            apiConfig.groupPermission.update.path,
            'not_have_delete',
            apiConfig.groupPermission.getPermissionList.path,
        ]
    },
    customer: {
        path: '/customer',
        permissions: [
            apiConfig.customer.getCustomerList.path,
            apiConfig.customer.getCustomerById.path,
            apiConfig.customer.createCustomer.path,
            apiConfig.customer.updateCustomer.path,
            apiConfig.customer.deleteCustomer.path,
        ]
    },
    categoryImport: {
        path: '/category-import',
        childrenKeys: ['/category-import-child'],
        permissions: [
            apiConfig.category.getList.path,
            apiConfig.category.getById.path,
            apiConfig.category.create.path,
            apiConfig.category.update.path,
            apiConfig.category.delete.path,
        ]
    },
    categoryExport: {
        path: '/category-export',
        childrenKeys: ['/category-export-child'],
        permissions: [
            apiConfig.category.getList.path,
            apiConfig.category.getById.path,
            apiConfig.category.create.path,
            apiConfig.category.update.path,
            apiConfig.category.delete.path,
        ]
    },
    categoryProduct: {
        path: '/category-product',
        childrenKeys: ['/category-product-child'],
        permissions: [
            apiConfig.category.getList.path,
            apiConfig.category.getById.path,
            apiConfig.category.create.path,
            apiConfig.category.update.path,
            apiConfig.category.delete.path,
        ]
    },
    product: {
        path: '/product',
        childrenKeys: ['/product-child'],
        permissions: [
            apiConfig.product.getList.path,
            apiConfig.product.getById.path,
            apiConfig.product.create.path,
            apiConfig.product.update.path,
            apiConfig.product.delete.path,
        ]
    },
    importManagement: {
        path: '/import-management',
        permissions: [
            apiConfig.importExportManagement.getList.path,
            apiConfig.importExportManagement.getById.path,
            apiConfig.importExportManagement.create.path,
            apiConfig.importExportManagement.update.path,
            apiConfig.importExportManagement.delete.path,
            apiConfig.importExportManagement.getCategoryAutoComplete.path,
        ]
    },
    exportManagement: {
        path: '/export-management',
        permissions: [
            apiConfig.importExportManagement.getList.path,
            apiConfig.importExportManagement.getById.path,
            apiConfig.importExportManagement.create.path,
            apiConfig.importExportManagement.update.path,
            apiConfig.importExportManagement.delete.path,
            apiConfig.importExportManagement.getCategoryAutoComplete.path,
        ]
    },
    employee: {
        path: '/employee',
        permissions: [
            apiConfig.user.getAdminList.path,
            apiConfig.user.getAdminById.path,
            apiConfig.user.createAdmin.path,
            apiConfig.user.updateAdmin.path,
            apiConfig.user.deleteAdmin.path,
        ]
    },
    booking: {
        path: '/booking',
        permissions: [
            apiConfig.booking.getProductAutoComplete.path,
            apiConfig.booking.getCustomerAutoComplete.path,
            apiConfig.booking.createOrders.path,
        ],
        siteConfig: {
            contentClass: 'booking-site',
        }
    },
    orders: {
        path: '/orders-management',
        permissions: [
            apiConfig.orders.getList.path,
            apiConfig.orders.getById.path,
            'no-create',
            apiConfig.orders.updateState.path,
            apiConfig.orders.cancelOrders.path,
            apiConfig.orders.update.path,
        ],
    },
    collaborator: {
        path: '/collaborator',
        permissions: [
            apiConfig.collaborator.getList.path,
            apiConfig.collaborator.getById.path,
            apiConfig.collaborator.create.path,
            apiConfig.collaborator.update.path,
            apiConfig.collaborator.delete.path,
            apiConfig.collaboratorProduct.getList.path,
        ]
    },
    employeeCollaborator: {
        path: '/employee-collaborator',
        childrenKeys: ['/collaborator', '/collaborator-product'],
        permissions: [
            apiConfig.collaborator.getEmployeeCollaboratorList.path,
            apiConfig.user.getAdminById.path,
            apiConfig.user.createAdmin.path,
            apiConfig.user.updateAdmin.path,
            apiConfig.user.deleteAdmin.path,
            apiConfig.collaboratorProduct.getList.path,
        ]
    },
    collaboratorProduct: {
        path: '/collaborator-product',
        permissions: [
            apiConfig.collaboratorProduct.getList.path,
            apiConfig.collaboratorProduct.getById.path,
            apiConfig.collaboratorProduct.create.path,
            apiConfig.collaboratorProduct.update.path,
            apiConfig.collaboratorProduct.delete.path,
        ],
        siteConfig: {
            contentClass: 'collaborator-site',
        }
    },
    collaboratorCategory: {
        path: '/collaborator-category',
        childrenKeys: ['/collaborator-category-product'],
        permissions: [
            apiConfig.category.getList.path,
            apiConfig.category.getById.path,
            apiConfig.category.create.path,
            apiConfig.category.update.path,
            apiConfig.category.delete.path,
        ],
        // TODO Handle show menu, permission depend on settings
        // settingConfig: {
        //     enableShow() {
        //         actions
        //     }
        // }
    },
    collaboratorCategoryProduct: {
        path: '/collaborator-category-product',
        permissions: [
            apiConfig.collaboratorCategoryProduct.getList.path,
            apiConfig.collaboratorCategoryProduct.getById.path,
            apiConfig.collaboratorCategoryProduct.create.path,
            apiConfig.collaboratorCategoryProduct.update.path,
            apiConfig.collaboratorCategoryProduct.delete.path,
        ],
        siteConfig: {
            contentClass: 'collaborator-site',
        }
    },
}