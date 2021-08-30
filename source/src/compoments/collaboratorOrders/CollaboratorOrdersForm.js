import React, { useEffect, useState, useRef } from "react";
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
import AutoCompleteField from "../common/entryForm/AutoCompleteField";
import { actions } from "../../actions";
import { useDispatch } from "react-redux";

const { Step } = Steps
const { confirm } = Modal

const OrdersForm = ({
    dataDetail,
    t,
}) => {

    const dispatch = useDispatch()
    const formRef = useRef()

    const {
        ordersDetailDtos,
        ordersVat,
        ordersState,
        ordersSaleOff,
        ordersPrevState,
    } = dataDetail

    const [productsList, setProductsList] = useState(ordersDetailDtos || [])
    const [totalPrice, setTotalPrice] = useState(0)
    const [saleOff, setSaleOff] = useState(ordersSaleOff)
    const [deletedOrdersDetailsList , setDeletedOrdersDetailsList] = useState([])

    const discountPrice = totalPrice * (saleOff / 100)
    const totalPriceAfterDiscount = totalPrice - discountPrice
    const vatPrice = totalPriceAfterDiscount * Number(ordersVat / 100)
    const finalPrice = totalPriceAfterDiscount + vatPrice

    useEffect(() => {
        let total = 0
        productsList.forEach(p => {
            total += p.price * p.amount
        })
        setTotalPrice(total)
    }, [productsList])

    useEffect(() => {
        formRef.current.setFieldsValue({
            customerPhone: dataDetail.customerDto?.customerPhone,
            customerFullName: dataDetail.customerDto?.customerFullName,
            customerEmail: dataDetail.customerDto?.customerEmail,
            id: dataDetail.customerDto?.id,
        })
    }, [])

    return (
    <div className="orders-form">
        <h2 className="state">{t("form.state")}:</h2>
        <Steps current={ordersState} size="small">
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
                <FieldSet title={t("form.fieldSet.customerInfo")}>
                    <Form
                        ref={formRef}
                        id="customer-info-form"
                        layout="vertical"
                        initialValues={dataDetail}
                        className='readonly-form'
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={"customerFullName"}
                                label={t("form.label.customerFullName")}
                                disabled
                                className="form-item-fullname"
                                />
                            </Col>
                            <Col span={12}>
                                <AutoCompleteField
                                    fieldName="customerPhone"
                                    label={t("form.label.customerPhone")}
                                    className="form-item-phone"
                                    required
                                    minLength={10}
                                    disabled
                                    optionValue="customerPhone"
                                    optionLabel="customerPhone"
                                    autoComplete="none"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={"customerEmail"}
                                label="E-mail"
                                disabled
                                className="form-item-email"
                                />
                                <NumericField
                                fieldName="ordersSaleOff"
                                label={`${t("form.label.ordersSaleOff")} (%)`}
                                min={0}
                                max={100}
                                className="form-item-discount"
                                disabled
                                width="100%"
                                parser={(value) => Utils.formatIntegerNumber(value)}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    fieldName="ordersAddress"
                                    label={`${t("form.label.ordersAddress")} (%)`}
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
                <FieldSet title={t("form.fieldSet.productList")} className="custom-fieldset fieldset-list">
                    <ul className="orders">
                        {
                            productsList.map(ordersDetail => {
                                const parentName = ordersDetail.productDto.parentName
                                const productName = parentName ? parentName + " (" + ordersDetail.productDto.productName + ")" : ordersDetail.productDto.productName
                                return (<li key={ordersDetail.id} className={`item`} style={{ backgroundColor: ordersDetail.productDto.labelColor, paddingRight: 8}}>
                                    <div className="item-content">
                                        <div className="col col-1">
                                            <p className="title">
                                            {ordersDetail.amount} x {productName}
                                            </p>
                                        </div>
                                        <div className="col col-2">
                                            <p className="price">
                                                {Utils.formatMoney( ordersDetail.price * ordersDetail.amount)}
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
                    <div className="title">{t("form.totalProductPrice")}:</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice)}
                    </div>
                </div>
                <div className="calculate-total discount">
                    <div className="title">{t("form.saleOff")}{ordersSaleOff > 0 ? ` (${ordersSaleOff}%)`: ''}:</div>
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
                    <div className="title">{t("form.totalPayment")}:</div>
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
