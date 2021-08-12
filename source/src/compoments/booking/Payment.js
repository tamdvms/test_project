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
import NumericField from '../common/entryForm/NumericField';
import { sitePathConfig } from '../../constants/sitePathConfig';
import ElementWithPermission from '../common/elements/ElementWithPermission';

const Payment = ({
    hide,
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
    const [discount, setDiscount] = useState(0)
    const [selectedPhone, setSelectedPhone] = useState("")
    const settings = actions.getUserData()?.settings
    const VAT =  settings && settings.Booking.vat

    const discountPrice = totalPrice * (discount / 100)
    const totalPriceAfterDiscount = totalPrice - discountPrice
    const vatPrice = totalPriceAfterDiscount * Number(VAT / 100)
    const finalPrice = totalPriceAfterDiscount + vatPrice

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

    const handleChangeDiscount = (value) => {
        setDiscount(value)
    }

    const handleSubmit = (values) => {
        handleSubmitPayment({
            ...values,
            totalPayment: finalPrice,
        }, (result) => {
            if(result) formRef.current.resetFields()
        })
    }

    useEffect(() => {
        const currentDiscount = formRef.current.getFieldValue("customerDiscount")
        formRef.current.setFieldsValue({
            customerDiscount: currentDiscount || 0
        })
    }, [hide])

    useEffect(() => {
        const selectedCustomer = customersList.find(customer => customer.customerPhone === selectedPhone)
        formRef.current.setFieldsValue(selectedCustomer)
    }, [selectedPhone])

    return (
        <div className={`payment-form${hide ? ' hide' : ''}`}>
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
                        onFinish={handleSubmit}
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
                                    className="form-item-phone"
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                fieldName="customerFullName"
                                label="Họ và tên"
                                required
                                disabled={loadingSave}
                                className="form-item-fullname"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName="customerEmail"
                                label="E-mail"
                                type="email"
                                disabled={loadingSave}
                                className="form-item-email"
                                />
                                <NumericField
                                fieldName="customerDiscount"
                                label="Giảm giá (%)"
                                disabled={loadingSave}
                                min={0}
                                max={100}
                                className="form-item-discount"
                                onChange={handleChangeDiscount}
                                width="100%"
                                parser={(value) => Utils.formatIntegerNumber(value)}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    fieldName="customerAddress"
                                    label="Địa chỉ"
                                    disabled={loadingSave}
                                    type="textarea"
                                    style={{ height: 102 }}
                                />
                            </Col>
                            <Col hidden>
                                <TextField
                                    fieldName="id"
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="list">
                    <h3>Danh sách mặt hàng</h3>
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
                <div className="calculate-total discount">
                    <div className="title">Giảm giá{discount > 0 ? ` (${discount}%)`: ''}:</div>
                    <div className="total">
                        {Utils.formatMoney(discountPrice)}
                    </div>
                </div>
                <div className="calculate-total vat">
                    <div className="title">VAT ({VAT}%):</div>
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
                <ElementWithPermission permissions={[sitePathConfig.booking.permissions[2]]}>
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
                </ElementWithPermission>
            </div>
        </div>
    )
}

export default Payment
