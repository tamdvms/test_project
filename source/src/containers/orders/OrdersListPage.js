import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Modal, Divider } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined } from "@ant-design/icons";
import qs from 'query-string';
import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import OrdersForm from "../../compoments/orders/OrdersForm";
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

class OrdersListPage extends ListBasePage {
    initialSearch() {
        return { employeeFullName: "", code: "", state: null };
    }

    constructor(props) {
        super(props);
        const { t } = props;
        this.pagination = { pageSize: 100 };
        this.objectName = t("objectName");
        this.breadcrumbs = [
            { name: t("breadcrumbs.currentPage") }
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
                title: t("table.employeeFullName"),
                dataIndex: 'employeeDto',
                render: (employeeDto) => {
                    return (
                        employeeDto?.labelColor
                            ? (<div>
                            <Tag color={employeeDto?.labelColor} style={{
                                padding: '2px 7px',
                                fontSize: '14px',
                            }}>{employeeDto?.fullName}</Tag>
                            </div>)
                            : <div style={{
                                padding: '2px 7px',
                            }}>{employeeDto?.fullName}</div>
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
                        <div className="tb-al-r">
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

    handleCancelStateNoConfirm = (values) => {
        const { updateStateOrders, cancelOrders, t } = this.props
        this.setState({
            isShowModifiedLoading: true,
        })
        cancelOrders({
            params: {
                ...values,
            },
            onCompleted: () => {
                this.getList()
                this.getDetail(this.dataDetail.id)
                showSucsessMessage(t("showSuccessMessage.update") , { t, ns: 'listBasePage' })
                this.setState({
                    isShowModifiedLoading: false,
                })
            },
            onError: (error) => {
                showErrorMessage(error.message || t("showErrorMessage.update"), { t, ns: 'listBasePage' })
                this.setState({
                    isShowModifiedLoading: false,
                })
            }
        })
    }

    handleUpdateState = (values) => {
        const { updateStateOrders, cancelOrders, t } = this.props
        confirm({
            title: t("confirmUpdateState"),
            content: '',
            okText: t("yes"),
            okType: 'danger',
            cancelText: t("no"),
            onOk: () => {
                this.setState({
                    isShowModifiedLoading: true,
                })
                if(values.ordersState != OrdersStates[4].value) {
                    updateStateOrders({
                        params: {
                            ...values,
                        },
                        onCompleted: () => {
                            this.getList()
                            this.getDetail(this.dataDetail.id)
                            showSucsessMessage(t("showSuccessMessage.update") , { t, ns: 'listBasePage' })
                            this.setState({
                                isShowModifiedLoading: false,
                            })
                        },
                        onError: (error) => {
                            showErrorMessage(error.message || t("showErrorMessage.update"), { t, ns: 'listBasePage' })
                            this.setState({
                                isShowModifiedLoading: false,
                            })
                        }
                    })
                }
                else {
                    cancelOrders({
                        params: {
                            ...values,
                        },
                        onCompleted: () => {
                            this.getList()
                            this.getDetail(this.dataDetail.id)
                            showSucsessMessage(t("showSuccessMessage.update") , { t, ns: 'listBasePage' })
                            this.setState({
                                isShowModifiedLoading: false,
                            })
                        },
                        onError: (error) => {
                            showErrorMessage(error.message || t("showErrorMessage.update"), { t, ns: 'listBasePage' })
                            this.setState({
                                isShowModifiedLoading: false,
                            })
                        }
                    })
                }
            },
            onCancel() {
              // console.log('Cancel');
            },
          });
    }

    handleUpdate = (values) => {
        const { updateData, t } = this.props
        this.setState({
            isShowModifiedLoading: true,
        })
        updateData({
            params: {
                ...values,
            },
            onCompleted: () => {
                this.getList()
                showSucsessMessage(t("showSuccessMessage.update") , { t, ns: 'listBasePage' })
                this.setState({
                    isShowModifiedLoading: false,
                    isShowModifiedModal: false,
                })
            },
            onError: (error) => {
                showErrorMessage(error.message || t("showErrorMessage.update"), { t, ns: 'listBasePage' })
                this.setState({
                    isShowModifiedLoading: false,
                })
            }
        })
    }

    renderUpdateButtons = () => {
        const { t } = this.props;
        const { isShowModifiedLoading } = this.state;
        return (<>
            <ElementWithPermission permissions={[sitePathConfig.orders.permissions[4]]}>
                <Button
                type="primary"
                loading={isShowModifiedLoading}
                className={
                    this.dataDetail.ordersState === OrdersStates[3].value
                    || this.dataDetail.ordersState === OrdersStates[4].value
                    ? 'btn-cancel-orders disabled' : 'btn-cancel-orders'
                }
                onClick={() => this.dataDetail.ordersState !== OrdersStates[3].value
                    && this.dataDetail.ordersState !== OrdersStates[4].value && this.handleUpdateState({
                    id: this.dataDetail.id,
                    ordersState: OrdersStates[4].value
                })}
                >
                    {t("cancelOrders")}
                </Button>
            </ElementWithPermission>
            <ElementWithPermission permissions={[sitePathConfig.orders.permissions[5]]}>
                <Button
                htmlType="submit"
                form="customer-info-form"
                type="primary"
                loading={isShowModifiedLoading}
                className={
                    this.dataDetail.ordersState > OrdersStates[0].value
                    ? 'btn-update-orders disabled' : 'btn-update-orders'
                }
                >
                    {t("save")}
                </Button>
            </ElementWithPermission>
        </>
        )
    }

    handleMatchBackgroundColor = (dataRow) => {
        const { randomColorsArrayByEmployeeId } = this.state;
        const key = Object.keys(randomColorsArrayByEmployeeId || {}).find(key => dataRow.employeeDto.id == key);
        return randomColorsArrayByEmployeeId?.[key] || '#fff';
    }

    handleSubmit = (values) => {
        this.dataDetail.ordersState === OrdersStates[0].value
        && this.handleUpdate(values)
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
            additionalButton={this.renderUpdateButtons()}
            >
            <OrdersForm
                dataDetail={this.isEditing ? this.dataDetail : {}}
                handleUpdateState={this.handleUpdateState}
                handleSubmit={this.handleSubmit}
                handleCancelStateNoConfirm={this.handleCancelStateNoConfirm}
                loadingSave={isShowModifiedLoading}
                t={t}
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
  updateStateOrders: (payload) => dispatch(actions.updateStateOrders(payload)),
  cancelOrders: (payload) => dispatch(actions.cancelOrders(payload)),
  updateData: (payload) => dispatch(actions.updateOrders(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['ordersListPage','listBasePage','constants', 'basicModal'])(OrdersListPage));
