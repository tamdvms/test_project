import React, { useEffect, useState } from "react";
import { Form, Col, Row, Steps } from "antd";

import TextField from "../common/entryForm/TextField";
import {
  AppConstants,
} from "../../constants";
import { OrdersStates } from "../../constants";
import Utils from "../../utils";
import FieldSet from "../common/elements/FieldSet";
import { sitePathConfig } from "../../constants/sitePathConfig";

const { Step } = Steps;

const OrdersForm = ({
    dataDetail,
    handleUpdateState,
    handleSubmit,
}) => {

    const {
        ordersDetailDtos,
        ordersTotalMoney,
        ordersVat,
        ordersState,
        ordersSaleOff,
        ordersPrevState,
    } = dataDetail
    const priceAfterDiscount = ordersTotalMoney / (1 + (ordersVat / 100))
    const priceBeforeDiscount = priceAfterDiscount / (1 - ordersSaleOff / 100)
    const priceVAT = ordersTotalMoney - priceAfterDiscount
    const priceDiscount = priceBeforeDiscount - priceAfterDiscount

    const [isReadonlyForm, setIsReadonlyForm] = useState(true)

    const handleChangeStep = (current) => {
        if(current > ordersState && current <  OrdersStates.length - 1) {
            const state = OrdersStates.find(state => state.value === current)
            handleUpdateState({
                id: dataDetail.id,
                ordersState: state.value
            })
        }
    }

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
                        className={`${ isReadonlyForm ? 'readonly-form' : ''}`}
                        onFinish={handleSubmit}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerFullName"]}
                                label="Họ và tên"
                                disabled={isReadonlyForm}
                                className="form-item-fullname"
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerPhone"]}
                                label="Số điện thoại"
                                disabled={isReadonlyForm}
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
                                disabled={isReadonlyForm}
                                className="form-item-email"
                                />
                                <TextField
                                fieldName="ordersSaleOff"
                                label="Giảm giá(%)"
                                disabled
                                className="form-item-email"
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    fieldName="ordersAddress"
                                    label="Địa chỉ"
                                    disabled={isReadonlyForm}
                                    type="textarea"
                                    style={{ height: 102 }}
                                />
                            </Col>
                        </Row>
                    </Form>
                </FieldSet>
            </div>
            <div className="list">
                <FieldSet title="Danh sách mặt hàng">
                    <ul className="orders">
                        {
                            ordersDetailDtos.map(ordersDetail => {
                                return (<li key={ordersDetail.id} className="item">
                                    <div className="item-content">
                                        <div className="col col-1">
                                            <p className="title">
                                                { ordersDetail.amount + " x " + ordersDetail.productDto.productName}
                                            </p>
                                        </div>
                                        <div className="col col-2">
                                            <p className="price">
                                                {Utils.formatMoney( ordersDetail.productDto.productPrice * ordersDetail.amount)}
                                            </p>
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
                        {Utils.formatMoney(priceBeforeDiscount)}
                    </div>
                </div>
                <div className="calculate-total discount">
                    <div className="title">Giảm giá{ordersSaleOff > 0 ? ` (${ordersSaleOff}%)`: ''}:</div>
                    <div className="total">
                        {Utils.formatMoney(priceDiscount)}
                    </div>
                </div>
                <div className="calculate-total vat">
                    <div className="title">VAT ({ordersVat}%):</div>
                    <div className="total">
                        {Utils.formatMoney(priceVAT)}
                    </div>
                </div>
                <div className="calculate-total product-vat">
                    <div className="title">Tổng tiền thanh toán:</div>
                    <div className="total">
                        {Utils.formatMoney(ordersTotalMoney)}
                    </div>
                </div>
            </FieldSet>
        </div>
    </div>
    );
}

export default OrdersForm;
