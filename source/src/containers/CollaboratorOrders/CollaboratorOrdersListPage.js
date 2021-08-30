import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Modal, Divider } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined } from "@ant-design/icons";
import qs from 'query-string';
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import CollaboratorOrdersForm from "../../compoments/collaboratorOrders/CollaboratorOrdersForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { AppConstants } from "../../constants";
import { commonStatus } from "../../constants/masterData";
import Utils from "../../utils";
import { OrdersStates } from "../../constants";
import { showErrorMessage, showSucsessMessage } from "../../services/notifyService";
import ElementWithPermission from "../../compoments/common/elements/ElementWithPermission";
import { sitePathConfig } from "../../constants/sitePathConfig";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";

const { confirm } = Modal

class CollaboratorOrdersListPage extends ListBasePage {
    initialSearch() {
        return { employeeFullName: "", code: "", state: null };
    }

    constructor(props) {
        super(props);
        const { t } = props;
        this.pagination = { pageSize: 100 };
        this.objectName = t("objectName");
        const { location: { search } } = props;
		const {
            parentName,
            parentId,
            parentSearchparentName,
        } = qs.parse(search);
		this.parentId = parentId;
		this.parentName = parentName;
        this.state = {
            isShowModifiedModal: false,
            isShowModifiedLoading: false,
            disableButton: null
        }
        this.breadcrumbs = [
            {
                name: `${t("breadcrumbs.employeePage")} (${parentSearchparentName})`,
                path: `${sitePathConfig.employeeCollaborator.path}${this.handleRoutingParent('parentSearchparentSearch')}`
            },
            {
                name: `${t("breadcrumbs.collaboratorPage")} (${parentName})`,
                path: `${sitePathConfig.collaborator.path}${this.handleRoutingParent('parentSearch')}`
            },
        ];
        this.columns = [
            {
                title: t("table.ordersCode"),
                dataIndex: "ordersCode",
                width: 115,
                render: (ordersCode) => {
                    return <div>#{ordersCode}</div>
                }
            },
            {
                title: <div style={{ paddingRight: 20 }}>{t("table.createdDate")}</div>,
                dataIndex: "createdDate",
                align: "right",
                width: 100,
                render: (createdDate) => <div style={{ paddingRight: 20, whiteSpace: 'nowrap' }}>{convertUtcToTimezone(createdDate, Utils.getSettingsDateFormat("date-format-product"))}</div>,
            },
            {
                title: t("table.customerFullName"),
                dataIndex: ['customerDto', 'customerFullName'],
                render: (customerFullName, dataRow) => {
                    return (
                        <div>
                            {customerFullName}
                        </div>
                    )
                }
            },
            {
                title: t("table.collaboratorFullName"),
                dataIndex: 'collaboratorDto',
                render: (collaboratorDto) => {
                    return (<div style={{
                                padding: '2px 7px',
                            }}>{collaboratorDto?.fullName}</div>
                    )
                }
            },
            {
                title: <div className="tb-al-r">{t("table.ordersTotalMoney")}</div>,
                dataIndex: 'ordersTotalMoney',
                align: 'right',
                width: 100,
                render: (ordersTotalMoney, dataRow) => {
                    return (
                        <div className="tb-al-r force-one-line">
                            {Utils.formatMoney(ordersTotalMoney)}
                        </div>
                    )
                }
            },
            {
                title: t("table.ordersState"),
                dataIndex: 'ordersState',
                width: 90,
                render: (ordersState, dataRow) => {
                    const state = OrdersStates.find(state => state.value === ordersState);
                    return (
                        <div>
                            <Tag style={
                                {
                                    background: state?.color,
                                    color: 'white',
                                    padding: '2px 7px',
                                    fontSize: '14px',
                                }
                            }>{state?.label}</Tag>
                        </div>
                    )
                }
            },
            this.renderActionColumn()
        ];
        this.actionColumns = {
            isEdit: {
                icon: <FileSearchOutlined />
            },
            isDelete: false,
            isChangeStatus: false,
        };
    }

    getList() {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, collaboratorId: this.parentId};
        getDataList({ params });
    }

    handleRoutingParent(prName) {
        const { location: { search } } = this.props;
        const queryString = qs.parse(search);
        const result = {};
        Object.keys(queryString).map(q => {
            if(q.startsWith(prName))
                result[q.substring(prName.length, q.length)] = queryString[q];
        })
        const qsMark = Object.keys(result).length > 0 ? "?" : "";
        return qsMark + qs.stringify(result);
    }

    getSearchFields() {
        const { t } = this.props;
        return [
            {
                key: "employeeFullName",
                seachPlaceholder: t("searchPlaceHolder.employeeFullName"),
                initialValue: this.search.employeeFullName,
            },
            {
                key: "code",
                seachPlaceholder: t("searchPlaceHolder.code"),
                initialValue: this.search.code,
            },
            {
                key: "state",
                seachPlaceholder: t("searchPlaceHolder.state"),
                fieldType: FieldTypes.SELECT,
                options: OrdersStates,
                initialValue: this.search.state,
            },
        ];
    }

    renderEditButton(children){
        const { location : { pathname }} = this.props;
        const requiredPermissions = [];
        Object.keys(sitePathConfig) && Object.keys(sitePathConfig).forEach(key=>{
            if(sitePathConfig[key].path === pathname){
                requiredPermissions.push(sitePathConfig[key].permissions?.[1]) //Get by id
            }
        })
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }

    render() {
        const {
            dataList,
            loading,
            t,
        } = this.props;
        const { isShowModifiedModal, isShowModifiedLoading } = this.state;
        const ordersData = dataList.data || [];
        this.pagination.total = dataList.totalElements || 0;
        return (
        <div className="orders-list-page">
            {this.renderSearchForm()}
            <div className="action-bar">
            </div>
            <BaseTable
            loading={loading}
            columns={this.columns}
            rowKey={(record) => record.id}
            dataSource={ordersData}
            pagination={this.pagination}
            onChange={this.handleTableChange}
            />
            <BasicModal
            className="orders-modal"
            visible={isShowModifiedModal}
            isEditing={this.isEditing}
            objectName={this.objectName}
            title={t("titleModal")}
            onCancel={this.onCancelModal}
            >
            <CollaboratorOrdersForm
                dataDetail={this.isEditing ? this.dataDetail : {}}
                loadingSave={isShowModifiedLoading}
                t={t}
                readOnly={true}
            />
            </BasicModal>
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
  loading: state.orders.tbOrdersLoading,
  dataList: state.orders.ordersData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getOrdersList(payload)),
  getDataById: (payload) => dispatch(actions.getOrdersById(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['collaboratorOrdersListPage','listBasePage','constants', 'basicModal'])(CollaboratorOrdersListPage));
