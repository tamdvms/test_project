import React from "react";
import { Form, Col, Row, Steps } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

import TextField from "../common/entryForm/TextField";
import {
  AppConstants,
} from "../../constants";
import { OrdersStates } from "../../constants";
import Utils from "../../utils";
import FieldSet from "../common/elements/FieldSet"

const { Step } = Steps;

const OrdersForm = ({
    dataDetail,
    handleUpdateState,
}) => {

    const {
        ordersDetailDtos,
        ordersTotalMoney,
        ordersVat,
        ordersState,
        ordersSaleOff,
    } = dataDetail
    const priceAfterDiscount = ordersTotalMoney / (1 + (ordersVat / 100))
    const priceBeforeDiscount = priceAfterDiscount / (1 - ordersSaleOff / 100)
    const priceVAT = ordersTotalMoney - priceAfterDiscount
    const priceDiscount = priceBeforeDiscount - priceAfterDiscount

    const handleChangeStep = (current) => {
        if(current > ordersState && current <  OrdersStates.length - 1) {
            const state = OrdersStates.find(state => state.value === current)
            handleUpdateState({
                id: dataDetail.id,
                ordersState: state.value
            })
        }
    }

    return (
    <div className="orders-form">
        <h2 className="state">Tình trạng đơn hàng:</h2>
        <Steps current={ordersState} onChange={handleChangeStep} size="small">
            {
                ordersState < OrdersStates[4].value
                ? OrdersStates.map((state, i) => {
                    if(state.value < ordersState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        status="finish"
                        />
                    }
                    else if (state.value === ordersState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.value !== OrdersStates[3].value ? <LoadingOutlined /> : state.icon}
                        className={ordersState === OrdersStates[3].value ? "done" : ""}
                        status="process"
                        />
                    }
                    else {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        status={"wait"}
                        className={state.value === OrdersStates[4].value ? 'cancel' : ''}
                        />
                    }
                })
                : OrdersStates.map((state, i) => {
                    if (state.value === ordersState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        status="finish"
                        />
                    }
                    else {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        status="wait"
                        />
                    }
                })
            }
        </Steps>
        <div className="payment-content">
            <div className="form">
                <FieldSet title="Thông tin khách hàng">
                    <Form
                        id="payment-form"
                        layout="vertical"
                        initialValues={dataDetail}
                        className="readonly-form"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerFullName"]}
                                label="Họ và tên"
                                disabled
                                className="form-item-fullname"
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerPhone"]}
                                label="Số điện thoại"
                                disabled
                                className="form-item-fullname"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={["customerDto", "customerEmail"]}
                                label="E-mail"
                                disabled
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
                                    disabled
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
        </div>
    </div>
    );
}

export default OrdersForm;
