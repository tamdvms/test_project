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
import { useTranslation } from 'react-i18next'

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
}) => {
    const { t } = useTranslation("bookingContainer")
    const resetFormObject = {
        customerEmail: null,
        customerFullName: null,
        customerPhone: null,
        ordersAddress: null,
    }

    const formRef = useRef()
    const [discount, setDiscount] = useState(0)
    const [selectedPhone, setSelectedPhone] = useState("")
    const [disabledFields, setDisabledFields] = useState(false)
    const settings = actions.getUserData()?.settings
    const VAT =  settings && settings.Booking.vat

    const discountPrice = totalPrice * (discount / 100)
    const totalPriceAfterDiscount = totalPrice - discountPrice
    const vatPrice = totalPriceAfterDiscount * Number(VAT / 100)
    const finalPrice = totalPriceAfterDiscount + vatPrice

    const handleSelectPhone = (value) => {
        setSelectedPhone(value)
        setDisabledFields(true)
    }

    const handleSearchPhone = (value) => {
        if(value) {
            setDisabledFields(false)
            formRef.current.setFieldsValue({
                ...resetFormObject,
                customerPhone: value,
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
            // totalPayment: finalPrice,
            // ordersVat: VAT,
        }, (result) => {
            if(result) {
                setSelectedPhone("")
                formRef.current.resetFields()
            }
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
                <h2>{t("page.payment")}</h2>
            </div>
            <div className="payment-content">
                <div className="form">
                    <h3>{t("page.customerInfo")}</h3>
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
                                    label={t("page.phoneNumber")}
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
                                label={t("page.fullName")}
                                required
                                disabled={loadingSave || disabledFields}
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
                                disabled={loadingSave || disabledFields}
                                className="form-item-email"
                                />
                                <NumericField
                                fieldName="customerDiscount"
                                label={t("page.discount") + " (%)"}
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
                                    label={t("page.address")}
                                    disabled={loadingSave}
                                    type="textarea"
                                    style={{ height: 102 }}
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="list">
                    <h3>{t("page.productList")}</h3>
                    <ul className="orders">
                        {
                            selectedItems.sort((a, b) => a.order - b.order).map(product => {
                                const saleoffPrice = product.productPrice - (product.productPrice * (product.saleoff / 100))
                                return (<li key={product.id} className="item" style={{ backgroundColor: product.labelColor }}>
                                    <div className="item-content">
                                        <div className="col col-1">
                                            <p className="title">
                                                { product.quantity + " x " + product.productName}
                                            </p>
                                        </div>
                                        <div className="col col-2">
                                            <p className="price">
                                                {Utils.formatMoney(saleoffPrice * product.quantity)}
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
                    <div className="title">{t("page.totalProductPrice")}</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice)}
                    </div>
                </div>
                <div className="calculate-total discount">
                    <div className="title">{t("page.discount")}{discount > 0 ? ` (${discount}%)`: ''}:</div>
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
                    <div className="title">{t("page.totalPayment")}</div>
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
                        {t("page.payment")}
                    </Button>
                </ElementWithPermission>
            </div>
        </div>
    )
}

export default Payment
