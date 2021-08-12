import React, { useRef, useState, useEffect } from 'react'
import { Input, Empty, Button, Avatar, Form, Modal, Spin, Col, Row } from 'antd'
import {
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    ShoppingFilled,
    PlusOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons'
import Utils from '../../utils'
import TextField from "../common/entryForm/TextField";
import AutoCompleteField from '../common/entryForm/AutoCompleteField';
import { actions } from '../../actions'

const Payment = ({
    selectedItems,
    totalPrice,
    setIsPaymenting,
    loadingSave,
    handleSubmitPayment,
    handleChangePhoneCustomer,
    customersList,
    listCustomerLoading,
    phoneInput,
    setPhoneInput,
}) => {
    const formRef = useRef()
    const [selectedPhone, setSelectedPhone] = useState("")
    const settings = actions.getUserData()?.settings
    const VAT =  settings && settings.Booking.vat

    const handleSelectPhone = (value) => {
        setSelectedPhone(value)
        setPhoneInput(value)
    }

    const handleSearchPhone = (value) => {
        if(value) {
            const selectedCustomer = customersList.find(customer => customer.customerPhone === value)
            formRef.current.setFieldsValue(selectedCustomer || {
                customerPhone: value
            })
            handleChangePhoneCustomer(value)
        }
    }

    useEffect(() => {
        const selectedCustomer = customersList.find(customer => customer.customerPhone === selectedPhone)
        formRef.current.setFieldsValue(selectedCustomer)
    }, [selectedPhone])

    return (
        <div className="payment-form">
            <div className="header">
                <Button className="back" onClick={() => setIsPaymenting(false)}><ArrowLeftOutlined/></Button>
                <h2>Thanh toán</h2>
            </div>
            <div className="payment-content">
                <div className="form">
                    <h3>Thông tin khách hàng</h3>
                    <Form
                        id="payment-form"
                        ref={formRef}
                        layout="vertical"
                        onFinish={handleSubmitPayment}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <AutoCompleteField
                                    fieldName="customerPhone"
                                    label="Số điện thoại"
                                    required
                                    minLength={10}
                                    disabled={loadingSave}
                                    optionValue="customerPhone"
                                    optionLabel="customerPhone"
                                    onSelect={handleSelectPhone}
                                    onSearch={handleSearchPhone}
                                    autoComplete="none"
                                    options={customersList}
                                    loading={listCustomerLoading}
                                    allowClear={true}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                fieldName="customerFullName"
                                label="Họ và tên"
                                required
                                disabled={loadingSave}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName="customerEmail"
                                label="E-mail"
                                type="email"
                                disabled={loadingSave} />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    fieldName="customerAddress"
                                    label="Địa chỉ"
                                    disabled={loadingSave}
                                    type="textarea"
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="list">
                    <h3>Danh sách đặt hàng</h3>
                    <ul className="orders">
                        {
                            selectedItems.sort((a, b) => a.order - b.order).map(product => {
                                return (<li key={product.id} className="item">
                                    <div className="item-content">
                                        <div className="col col-1">
                                            <p className="title">
                                                { product.quantity + " x " + product.productName}
                                            </p>
                                        </div>
                                        <div className="col col-2">
                                            <p className="price">
                                                {Utils.formatMoney(product.productPrice * product.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="note-content">{product.note}</p>
                                </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="bottom">
                <div className="calculate-total product">
                    <div className="title">Tổng tiền đơn hàng:</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice)}
                    </div>
                </div>
                <div className="calculate-total vat">
                    <div className="title">VAT:</div>
                    <div className="total">
                        {VAT} %
                    </div>
                </div>
                <div className="calculate-total product-vat">
                    <div className="title">Tổng tiền:</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice + totalPrice * Number(VAT / 100))}
                    </div>
                </div>
                <Button
                form="payment-form"
                htmlType="submit"
                className="payment"
                type="primary"
                disabled={selectedItems.length <= 0}
                loading={loadingSave}
                >
                    Đặt hàng
                </Button>
            </div>
        </div>
    )
}

export default Payment
