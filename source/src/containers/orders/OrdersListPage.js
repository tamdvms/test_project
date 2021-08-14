import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Modal, Divider } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import qs from 'query-string';

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

const { confirm } = Modal

class OrdersListPage extends ListBasePage {
    initialSearch() {
        return { employeeFullName: "", state: null };
    }

    constructor(props) {
        super(props);

        this.pagination = { pageSize: 100 };
        this.objectName =  "Đơn hàng";
        this.breadcrumbs = [
            { name: "Đơn hàng" }
        ];
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                width: '50px',
                align: 'center',
                render: (id, dataRow) => {
                    return (
                        <div
                        className="cell-fill-parent"
                        style={{
                            backgroundColor: this.handleMatchBackgroundColor(dataRow)
                        }}
                        >
                            {id}
                        </div>
                    )
                }
            },
            {
                title: 'Khách hàng',
                dataIndex: ['customerDto', 'customerFullName'],
                render: (customerFullName, dataRow) => {
                    return (
                        <div
                        className="cell-fill-parent align-left"
                        style={{
                            backgroundColor: this.handleMatchBackgroundColor(dataRow)
                        }}
                        >
                            {customerFullName}
                        </div>
                    )
                }
            },
            {
                title: 'Nhân viên',
                dataIndex: ['employeeDto', 'fullName'],
                render: (fullName, dataRow) => {
                    return (
                        <div
                        className="cell-fill-parent align-left"
                        style={{
                            backgroundColor: this.handleMatchBackgroundColor(dataRow)
                        }}
                        >
                            {fullName}
                        </div>
                    )
                }
            },
            {
                title: <div className="tb-al-r">Số tiền</div>,
                dataIndex: 'ordersTotalMoney',
                align: 'right',
                render: (ordersTotalMoney, dataRow) => {
                    return (
                        <div
                        className="tb-al-r cell-fill-parent align-right"
                        style={{
                            backgroundColor: this.handleMatchBackgroundColor(dataRow)
                        }}
                        >
                            {Utils.formatMoney(ordersTotalMoney)}
                        </div>
                    )
                }
            },
            {
                title: 'Tình trạng',
                dataIndex: 'ordersState',
                width: 90,
                render: (ordersState, dataRow) => {
                    const state = OrdersStates.find(state => state.value === ordersState);
                    return (
                        <div
                        className="cell-fill-parent align-left"
                        style={{
                            backgroundColor: this.handleMatchBackgroundColor(dataRow),
                        }}
                        >
                            <Tag color={state?.color}>{state?.label}</Tag>
                        </div>
                    )
                }
            },
            {
                title: 'Hành động',
                width: '100px',
                align: 'center',
                render: (dataRow) => {
                    const actionColumns = [];
                    if(this.actionColumns.isEdit) {
                        actionColumns.push(this.renderEditButton((
                            <Button type="link" onClick={() => this.getDetail(dataRow.id)} className="no-padding">
                                <EditOutlined/>
                            </Button>
                        )))
                    }
                    if(this.actionColumns.isDelete) {
                        actionColumns.push(
                            this.renderDeleteButton((
                                <Button type="link" onClick={() => this.showDeleteConfirm(dataRow.id) } className="no-padding">
                                    <DeleteOutlined/>
                                </Button>
                            ))
                        )
                    }
                    const actionColumnsWithDivider = [];
                    actionColumns.forEach((action, index) => {
                        actionColumnsWithDivider.push(action);
                        if(index !== (actionColumns.length -1))
                        {
                            actionColumnsWithDivider.push(<Divider type="vertical" />);
                        }
                    })
                    return (
                        <div
                        className="cell-fill-parent absolute"
                        style={{
                            backgroundColor: this.handleMatchBackgroundColor(dataRow),
                        }}
                        >
                            {
                                actionColumnsWithDivider.map((action, index) => <span key={index}>{action}</span>)
                            }
                        </div>
                    )
                }
            },
        ];
        this.actionColumns = {
            isEdit: true,
            isDelete: false,
            isChangeStatus: false,
        };
    }

    getList() {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search};
        getDataList({
            params,
            onCompleted: (data = []) => {
                const randomColorsArrayByEmployeeId = data.reduce((r, a) => {
                    r[a.employeeDto.id] = null;
                    return r;
                   }, {})
                Object.keys(randomColorsArrayByEmployeeId).forEach(employeeId => {
                    randomColorsArrayByEmployeeId[employeeId] = Utils.getRandomColor()
                })
                this.setState({
                    randomColorsArrayByEmployeeId,
                })
            },
        });
    }

    getSearchFields() {
        return [
            {
                key: "employeeFullName",
                seachPlaceholder: 'Tên nhân viên',
                initialValue: this.search.employeeFullName,
            },
            {
                key: "state",
                seachPlaceholder: "Chọn tình trạng",
                fieldType: FieldTypes.SELECT,
                options: OrdersStates,
                initialValue: this.search.state,
            },
        ];
    }

    handleUpdateState = (values) => {
        const { updateData, cancelOrders } = this.props
        confirm({
            title: `Bạn có chắc muốn thay đổi trạng thái đơn hàng này?`,
            content: '',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: () => {
                this.setState({
                    isShowModifiedLoading: true,
                })
                if(values.ordersState != OrdersStates[4].value) {
                    updateData({
                        params: {
                            ...values,
                        },
                        onCompleted: () => {
                            this.getList()
                            showSucsessMessage("Cập nhật thành công!")
                            this.setState({
                                isShowModifiedLoading: false,
                                isShowModifiedModal: false,
                            })
                        },
                        onError: (error) => {
                            showErrorMessage(error.message || "Cập nhật thất bại. Vui lòng thử lại!")
                            this.setState({
                                isShowModifiedLoading: false,
                                isShowModifiedModal: false,
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
                            showSucsessMessage("Cập nhật thành công!")
                            this.setState({
                                isShowModifiedLoading: false,
                                isShowModifiedModal: false,
                            })
                        },
                        onError: (error) => {
                            showErrorMessage(error.message || "Cập nhật thất bại. Vui lòng thử lại!")
                            this.setState({
                                isShowModifiedLoading: false,
                                isShowModifiedModal: false,
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

    renderCancelOrdersButton = () => {
        const { isShowModifiedLoading } = this.props;
        return (<ElementWithPermission permissions={[sitePathConfig.orders.permissions[4]]}>
            <Button
            type="primary"
            loading={isShowModifiedLoading}
            className={
                this.dataDetail.ordersState === OrdersStates[3].value
                || this.dataDetail.ordersState === OrdersStates[4].value
                ? 'disabled' : ''
            }
            style={{
                background: '#ccc',
                border: 'none',
            }}
            onClick={() => this.dataDetail.ordersState !== OrdersStates[3].value
                && this.dataDetail.ordersState !== OrdersStates[4].value && this.handleUpdateState({
                id: this.dataDetail.id,
                ordersState: OrdersStates[4].value
            })}
            >
                Hủy đơn hàng
            </Button>
        </ElementWithPermission>)
    }

    handleMatchBackgroundColor = (dataRow) => {
        const { randomColorsArrayByEmployeeId } = this.state;
        const key = Object.keys(randomColorsArrayByEmployeeId || {}).find(key => dataRow.employeeDto.id == key);
        return randomColorsArrayByEmployeeId?.[key] || '#fff';
    }

    render() {
        const {
            dataList,
            loading,
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
            width={800}
            visible={isShowModifiedModal}
            isEditing={this.isEditing}
            objectName={this.objectName}
            title="CHI TIẾT ĐƠN HÀNG"
            onCancel={this.onCancelModal}
            additionalButton={this.renderCancelOrdersButton()}
            >
            <OrdersForm
                dataDetail={this.isEditing ? this.dataDetail : {}}
                handleUpdateState={this.handleUpdateState}
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
  updateData: (payload) => dispatch(actions.updateOrders(payload)),
  cancelOrders: (payload) => dispatch(actions.cancelOrders(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersListPage);
