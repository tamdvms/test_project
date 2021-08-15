import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Modal, Divider } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined } from "@ant-design/icons";
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
import { convertUtcToTimezone } from "../../utils/datetimeHelper";

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
            this.renderIdColumn(),
            {
                title: <div style={{ paddingRight: 20 }}>Ngày tạo</div>,
                dataIndex: "createdDate",
                align: "right",
                width: 100,
                render: (createdDate) => <div style={{ paddingRight: 20, whiteSpace: 'nowrap' }}>{convertUtcToTimezone(createdDate, Utils.getSettingsDateFormat("date-format-product"))}</div>,
            },
            {
                title: 'Khách hàng',
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
                title: 'Nhân viên',
                dataIndex: 'employeeDto',
                render: (employeeDto) => {
                    return (
                        employeeDto.labelColor
                            ? (<div>
                            <Tag color={employeeDto.labelColor} style={{
                                padding: '2px 7px',
                                fontSize: '14px',
                            }}>{employeeDto.fullName}</Tag>
                            </div>)
                            : employeeDto.fullName
                    )
                }
            },
            {
                title: <div className="tb-al-r">Số tiền</div>,
                dataIndex: 'ordersTotalMoney',
                align: 'right',
                render: (ordersTotalMoney, dataRow) => {
                    return (
                        <div className="tb-al-r">
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
                        <div>
                            <Tag color={state?.color} style={
                                state.value === OrdersStates[4].value ? {
                                    background: 'red',
                                    color: 'white',
                                } : {}
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

    handleCancelStateNoConfirm = (values) => {
        const { updateStateOrders, cancelOrders } = this.props
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
                showSucsessMessage("Cập nhật thành công!")
                this.setState({
                    isShowModifiedLoading: false,
                })
            },
            onError: (error) => {
                showErrorMessage(error.message || "Cập nhật thất bại. Vui lòng thử lại!")
                this.setState({
                    isShowModifiedLoading: false,
                })
            }
        })
    }

    handleUpdateState = (values) => {
        const { updateStateOrders, cancelOrders } = this.props
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
                    updateStateOrders({
                        params: {
                            ...values,
                        },
                        onCompleted: () => {
                            this.getList()
                            this.getDetail(this.dataDetail.id)
                            showSucsessMessage("Cập nhật thành công!")
                            this.setState({
                                isShowModifiedLoading: false,
                            })
                        },
                        onError: (error) => {
                            showErrorMessage(error.message || "Cập nhật thất bại. Vui lòng thử lại!")
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
                            showSucsessMessage("Cập nhật thành công!")
                            this.setState({
                                isShowModifiedLoading: false,
                            })
                        },
                        onError: (error) => {
                            showErrorMessage(error.message || "Cập nhật thất bại. Vui lòng thử lại!")
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
        const { updateData } = this.props
        this.setState({
            isShowModifiedLoading: true,
        })
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

    renderUpdateButtons = () => {
        const { isShowModifiedLoading } = this.props;
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
                    Hủy đơn hàng
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
                    Lưu
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
            title="CHI TIẾT ĐƠN HÀNG"
            onCancel={this.onCancelModal}
            additionalButton={this.renderUpdateButtons()}
            >
            <OrdersForm
                dataDetail={this.isEditing ? this.dataDetail : {}}
                handleUpdateState={this.handleUpdateState}
                handleSubmit={this.handleSubmit}
                handleCancelStateNoConfirm={this.handleCancelStateNoConfirm}
                loadingSave={isShowModifiedLoading}
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

export default connect(mapStateToProps, mapDispatchToProps)(OrdersListPage);
