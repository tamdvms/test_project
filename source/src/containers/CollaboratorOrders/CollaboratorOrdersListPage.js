import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Modal, Divider } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined } from "@ant-design/icons";
import qs from 'query-string';
import { withTranslation } from "react-i18next";
import moment from "moment";

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
import SearchForm from "../../compoments/common/entryForm/SearchForm";
import { convertTimezoneToUtc } from "../../utils/datetimeHelper";

const { confirm } = Modal

class CollaboratorOrdersListPage extends ListBasePage {
    initialSearch() {
        return { fromDateToDate: [moment().startOf('month'), moment().endOf('month')] , state: null };
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
                dataIndex: "code",
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
                dataIndex: 'customerFullName',
                render: (customerFullName) => {
                    return (
                        <div>
                            {customerFullName}
                        </div>
                    )
                }
            },
            {
                title: <div className="tb-al-r">{t("table.ordersTotalMoney")}</div>,
                dataIndex: 'totalMoney',
                align: 'right',
                width: 100,
                render: (totalMoney, dataRow) => {
                    return (
                        <div className="tb-al-r force-one-line">
                            {Utils.formatMoney(totalMoney)}
                        </div>
                    )
                }
            },
            {
                title: <span className="tb-al-r">{t("table.totalCollaboratorCommission")}</span>,
                dataIndex: 'totalCollaboratorCommission',
                width: 90,
                align: 'right',
                render: (totalCollaboratorCommission) => {
                    return <div className="force-one-line tb-al-r">{Utils.formatMoney(totalCollaboratorCommission)}</div>
                }
            },
            {
                title: t("table.ordersState"),
                dataIndex: 'state',
                width: 90,
                render: (state, dataRow) => {
                    const _state = OrdersStates.find(s => s.value === state);
                    return (
                        <div>
                            <Tag style={
                                {
                                    background: _state?.color,
                                    color: 'white',
                                    padding: '2px 7px',
                                    fontSize: '14px',
                                }
                            }>{_state?.label}</Tag>
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

    renderSearchForm(hiddenAction) {
        const searchFields = this.getSearchFields();
		const from = this.search.fromDateToDate?.[0];
		const to = this.search.fromDateToDate?.[1];
        if(searchFields.length > 0)
            return <SearchForm
                searchFields={searchFields}
                onSubmit={this.onSearch}
                onResetForm={this.onResetFormSearch}
                hiddenAction={hiddenAction}
                initialValues={
					{
						...this.search,
						fromDateToDate: from && to ? [
							moment(from),
							moment(to),
						] : undefined,
					}
				}
                />;
        return null;
    }

    getList() {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const fromDateToDate = {
            ...this.search.fromDateToDate
        }
        const from = moment(fromDateToDate[0]);
        const to = moment(fromDateToDate[1]);
        if(from && to) {
            fromDateToDate[0] = convertTimezoneToUtc(moment(from).format("DD/MM/YYYY") + " 00:00:00", "DD/MM/YYYY HH:mm:ss");
            fromDateToDate[1] = convertTimezoneToUtc(moment(to).format("DD/MM/YYYY") + " 23:59:59", "DD/MM/YYYY HH:mm:ss");
        }
        const params = {
            page,
            size: this.pagination.pageSize,
            search: {
                ...this.search,
                fromDateToDate,
            },
            collaboratorId: this.parentId
        }
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
				key: 'fromDateToDate',
				seachPlaceholder: [t("searchPlaceHolder.fromDate"), t("searchPlaceHolder.toDate")],
				fieldType: FieldTypes.DATE_RANGE,
				format: "DD/MM/YYYY",
				disabledDate: (current) => {
					// Can not select days after today
					return current > moment().endOf('day');
				},
				width: 250,
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
  loading: state.orders.tbCollaboratorOrdersLoading,
  dataList: state.orders.collaboratorOrdersData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getCollaboratorOrdersList(payload)),
  getDataById: (payload) => dispatch(actions.getOrdersById(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['collaboratorOrdersListPage','listBasePage','constants', 'basicModal'])(CollaboratorOrdersListPage));
