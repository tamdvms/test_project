import React, { useEffect, useState } from "react";
import { Form, Col, Row, Steps, Button, Modal } from "antd";
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons'

import TextField from "../common/entryForm/TextField";
import {
  AppConstants,
} from "../../constants";
import { OrdersStates } from "../../constants";
import Utils from "../../utils";
import FieldSet from "../common/elements/FieldSet";
import { sitePathConfig } from "../../constants/sitePathConfig";
import NumericField from "../common/entryForm/NumericField";

const { Step } = Steps
const { confirm } = Modal

const OrdersForm = ({
    dataDetail,
    handleUpdateState,
    handleSubmit,
    handleCancelStateNoConfirm,
    loadingSave,
}) => {

    const {
        ordersDetailDtos,
        ordersVat,
        ordersState,
        ordersSaleOff,
        ordersPrevState,
    } = dataDetail

    const [isReadonlyForm, setIsReadonlyForm] = useState(true)
    const [productsList, setProductsList] = useState(ordersDetailDtos)
    const [totalPrice, setTotalPrice] = useState(0)
    const [saleOff, setSaleOff] = useState(ordersSaleOff)
    const [deletedOrdersDetailsList , setDeletedOrdersDetailsList] = useState([])

    const discountPrice = totalPrice * (saleOff / 100)
    const totalPriceAfterDiscount = totalPrice - discountPrice
    const vatPrice = totalPriceAfterDiscount * Number(ordersVat / 100)
    const finalPrice = totalPriceAfterDiscount + vatPrice

    const handleChangeStep = (current) => {
        if(current > ordersState && current <  OrdersStates.length - 1) {
            const state = OrdersStates.find(state => state.value === current)
            handleUpdateState({
                id: dataDetail.id,
                ordersState: state.value
            })
        }
    }

    const prepareDataSubmit = (values) => {
        handleSubmit({
            id: dataDetail.id,
            customerEmail: values.customerDto?.customerEmail,
            customerFullName: values.customerDto?.customerFullName,
            customerPhone: values.customerDto?.customerPhone,
            ordersAddress: values.ordersAddress,
            ordersCustomerId: values.customerDto?.id,
            ordersSaleOff: values.ordersSaleOff,
            ordersDetailDtos: productsList.map(p => ({
                amount: p.amount,
                employeeCommission: p.employeeCommission,
                id: p.id,
                ordersId: p.ordersId,
                price: p.price,
                productId: p.productDto.id,
                note: p.note,
            })),
            deletingOrdersDetails: deletedOrdersDetailsList,

        })
    }

    const handleRemoveSelectingItem = (product, isCancel) => {
        confirm({
            title: `${isCancel ? "Xóa sản phẩm cuối cùng sẽ chuyển trạng thái đơn hàng thành 'Đã hủy' (vẫn giữ lại sản phẩm)! Bạn có muốn thực hiện?" : "Bạn có chắc muốn xóa sản phẩm này?"}`,
            content: '',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: () => {
                if(!isCancel) {
                    const newProductsList = [...productsList]
                    const deleteds = newProductsList.splice(newProductsList.findIndex(p => p.productDto.id === product.id), 1)
                    Promise.resolve().then(() => {
                        setDeletedOrdersDetailsList(deleteds)
                        setProductsList(newProductsList)
                    })
                }
                else {
                    handleCancelStateNoConfirm({
                        id: dataDetail.id,
                        ordersState: OrdersStates[4].value
                    })
                }
            },
            onCancel() {
            },
          });
    }

    const handleChangeAmountItem = (product, value) => {
        const newProductsList = [...productsList]
        newProductsList[newProductsList.findIndex(p => p.productDto.id === product.id)].amount += value
        setProductsList(newProductsList)
    }

    const handleChangeSaleOff = (value) => {
        setSaleOff(value)
    }

    useEffect(() => {
        let total = 0
        productsList.forEach(p => {
            total += p.price * p.amount
        })
        setTotalPrice(total)
    }, [productsList])

    useEffect(() => {
        setIsReadonlyForm(!Utils.checkPermission([sitePathConfig.orders.permissions[5]]) || ordersState > OrdersStates[0].value)
    }, [])

    return (
    <div className="orders-form">
        <h2 className="state">Tình trạng đơn hàng:</h2>
        <Steps current={ordersState} onChange={handleChangeStep} size="small">
            {
                ordersState < OrdersStates[3].value
                ? OrdersStates.map((state, i) => {
                    if(i >= OrdersStates.length - 1) return null
                    if(ordersState > state.value) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className="finish"
                        status="finish"
                        />
                    }
                    else if (ordersState === state.value) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className={`process${state.value === OrdersStates[4].value ? ' cancel' : ''}`}
                        status="process"
                        />
                    }
                    else if(ordersState < state.value){
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className={`wait${state.value === OrdersStates[4].value ? ' cancel' : ''}`}
                        status="wait"
                        />
                    }
                    return null
                })
                : OrdersStates.map((state, i) => {
                    if(state.value < ordersPrevState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className="finish has-prev-state"
                        status="finish"
                        />
                    }
                    else if(state.value === ordersPrevState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className="finish is-prev-state"
                        status="finish"
                        />
                    }
                    else if(state.value === ordersState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className={`process${state.value === OrdersStates[4].value ? ' cancel' : ''}`}
                        status="process"
                        />
                    }
                    return null
                })
            }
        </Steps>
        <div className="payment-content">
            <div className="form">
                <FieldSet title="Thông tin khách hàng">
                    <Form
                        id="customer-info-form"
                        layout="vertical"
                        initialValues={dataDetail}
                        className={`${ isReadonlyForm || loadingSave ? 'readonly-form' : ''}`}
                        onFinish={prepareDataSubmit}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerFullName"]}
                                label="Họ và tên"
                                disabled={isReadonlyForm || loadingSave}
                                className="form-item-fullname"
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerPhone"]}
                                label="Số điện thoại"
                                disabled={isReadonlyForm || loadingSave}
                                className="form-item-fullname"
                                />
                            </Col>
                            <Col hidden>
                                <TextField
                                fieldName={["customerDto", "id"]}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerEmail"]}
                                label="E-mail"
                                disabled={isReadonlyForm || loadingSave}
                                className="form-item-email"
                                />
                                <NumericField
                                fieldName="ordersSaleOff"
                                label="Giảm giá (%)"
                                min={0}
                                max={100}
                                className="form-item-discount"
                                disabled={isReadonlyForm || loadingSave}
                                onChange={handleChangeSaleOff}
                                width="100%"
                                parser={(value) => Utils.formatIntegerNumber(value)}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    fieldName="ordersAddress"
                                    label="Địa chỉ"
                                    disabled={isReadonlyForm || loadingSave}
                                    type="textarea"
                                    style={{ height: 102 }}
                                />
                            </Col>
                        </Row>
                    </Form>
                </FieldSet>
            </div>
            <div className="list">
                <FieldSet title="Danh sách mặt hàng" className="custom-fieldset fieldset-list">
                    <ul className="orders">
                        {
                            productsList.map(ordersDetail => {
                                return (<li key={ordersDetail.id} className={`item`} style={{ backgroundColor: ordersDetail.productDto.labelColor, paddingRight: isReadonlyForm ? 0 : 32, paddingLeft: isReadonlyForm ? 0 : 8 }}>
                                    <div className="item-content">
                                        <div className="col col-1">
                                            <div className="quantity-edition">
                                                <Button
                                                className={`minus${isReadonlyForm ? ' display-none' : ''}`}
                                                onClick={() => {
                                                    if(ordersDetail.amount <= 1) {
                                                        handleRemoveSelectingItem(ordersDetail.productDto, productsList.length === 1)
                                                    }
                                                    else {
                                                        handleChangeAmountItem(ordersDetail.productDto, -1)
                                                    }
                                                }}
                                                >
                                                    -
                                                </Button>
                                                <span className="quantity" style={isReadonlyForm ? { marginRight: 4, marginLeft: 0 } : {}}>{ordersDetail.amount}</span>
                                                <Button
                                                className={`plus${isReadonlyForm ? ' display-none' : ''}`}
                                                onClick={() => handleChangeAmountItem(ordersDetail.productDto, 1)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <p className="title">
                                                { isReadonlyForm ? " x " : "" }{ordersDetail.productDto.productName}
                                            </p>
                                        </div>
                                        <div className="col col-2">
                                            <p className="price">
                                                {Utils.formatMoney( ordersDetail.price * ordersDetail.amount)}
                                            </p>
                                            <DeleteOutlined
                                            className={`delete-btn${isReadonlyForm ? ' display-none' : ''}`}
                                            onClick={() => handleRemoveSelectingItem(ordersDetail.productDto, productsList.length === 1)}
                                            />
                                        </div>
                                    </div>
                                    <p className="note-content">{ ordersDetail.note}</p>
                                </li>
                                )
                            })
                        }
                    </ul>
                </FieldSet>
            </div>
        </div>
        <div className="bottom">
            <FieldSet className="custom-fieldset none-legend">
                <div className="calculate-total product">
                    <div className="title">Tổng tiền đơn hàng:</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice)}
                    </div>
                </div>
                <div className="calculate-total discount">
                    <div className="title">Giảm giá{ordersSaleOff > 0 ? ` (${ordersSaleOff}%)`: ''}:</div>
                    <div className="total">
                        {Utils.formatMoney(discountPrice)}
                    </div>
                </div>
                <div className="calculate-total vat">
                    <div className="title">VAT ({ordersVat}%):</div>
                    <div className="total">
                        {Utils.formatMoney(vatPrice)}
                    </div>
                </div>
                <div className="calculate-total product-vat">
                    <div className="title">Tổng tiền thanh toán:</div>
                    <div className="total">
                        {Utils.formatMoney(finalPrice)}
                    </div>
                </div>
            </FieldSet>
        </div>
    </div>
    );
}

export default OrdersForm;
