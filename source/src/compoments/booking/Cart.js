import React from 'react'
import { Input, Empty, Button, Avatar, Form, Modal, Spin } from 'antd'
import { EditOutlined, SearchOutlined, ShoppingFilled, PlusOutlined, DeleteFilled } from '@ant-design/icons'
import Utils from '../../utils'
import ElementWithPermission from '../common/elements/ElementWithPermission'
import { sitePathConfig } from '../../constants/sitePathConfig'
import { actions } from '../../actions'

const { TextArea } = Input

const Cart = ({
    hide,
    selectedItems,
    handleEventOnItem,
    handleRemoveSelectingItem,
    totalPrice,
    setIsPaymenting,
}) => {

    const settings = actions.getUserData()?.settings
    const VAT =  settings && settings.Booking.vat

    const handleSubmitNote = (values, product) => {
        handleEventOnItem({
            ...product,
            note: values["textarea-" + product.id]
        }, "submitNote")
    }
    return (
        <div className={`cart${hide ? ' hide' : ''}`}>
            <div className="header">
                <h2>Giỏ hàng</h2>
            </div>
            <div className="list">
                <ul className="orders">
                    {
                        selectedItems.length > 0
                        ? selectedItems.sort((a, b) => a.order - b.order).map(product => {
                            return (<li key={product.id} className="item" style={{ backgroundColor: product.labelColor }}>
                                <div className="item-content">
                                    <div className="col col-1">
                                        <p className="title">
                                            {product.productName}
                                        </p>
                                        <div className="action">
                                            {
                                                !product.isShowNote ? (
                                                    <Button
                                                    className="note-btn"
                                                    type="ghost"
                                                    onClick={() => handleEventOnItem(product, "toggleDescription" )}
                                                    >
                                                        {product.note ? "Sửa" : "Thêm"} ghi chú
                                                        {product.note ? <EditOutlined /> : <PlusOutlined />}
                                                    </Button>
                                                ) : null
                                            }
                                            <DeleteFilled 
                                            className="delete-btn"
                                            onClick={() => handleRemoveSelectingItem(product)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-2">
                                        <p className="price">
                                            {Utils.formatMoney(product.productPrice * product.quantity)}
                                        </p>
                                        <div className="quantity-edition">
                                            <Button
                                            className="minus"
                                            onClick={() => {
                                                if(product.quantity <= 1) {
                                                    handleRemoveSelectingItem(product)
                                                }
                                                else {
                                                    handleEventOnItem(product, "minusQuantity")
                                                }
                                            }}
                                            >
                                                -
                                            </Button>
                                            <span className="quantity">{product.quantity}</span>
                                            <Button
                                            className="plus"
                                            onClick={() => handleEventOnItem(product, "plusQuantity")}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className={`note${!product.isShowNote ? " hide" : ""}`}>
                                    <Form
                                    id={"form-" + product.id}
                                    className="form"
                                    onFinish={(values) => handleSubmitNote(values, product)}
                                    >
                                        <Form.Item
                                        name={"textarea-" + product.id}
                                        noStyle
                                        >
                                            <TextArea
                                            placeholder="Điền vào đây"
                                            value={product.note}
                                            onPressEnter={(e) => { handleSubmitNote(
                                                {
                                                    ["textarea-" + product.id]: e.target.value,
                                                },
                                                product
                                            ) }}
                                            />
                                        </Form.Item>
                                    </Form>
                                    <Button
                                    htmlType="submit"
                                    className="submit-note"
                                    type="primary"
                                    form={"form-" + product.id}
                                    >
                                        Đồng ý
                                    </Button>
                                </div>
                                {
                                    product.note ? (
                                        <p className="note-content">{product.note}</p>
                                    ) : null
                                }
                            </li>
                            )
                        })
                        : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
                    }
                </ul>
            </div>
            <div className="bottom">
                <div className="calculate-total product">
                    <div className="title">Tổng tiền đơn hàng:</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice)}
                    </div>
                </div>
                <div className="calculate-total vat">
                    <div className="title">VAT ({VAT}%):</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice * (VAT / 100))}
                    </div>
                </div>
                <div className="calculate-total product-vat">
                    <div className="title">Tổng tiền thanh toán:</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice + totalPrice * Number(VAT / 100))}
                    </div>
                </div>
                <ElementWithPermission permissions={[sitePathConfig.booking.permissions[1]]}>
                    <Button
                    className="payment"
                    type="primary"
                    disabled={selectedItems.length <= 0}
                    onClick={() => setIsPaymenting(true)}
                    >Tiếp theo</Button>
                </ElementWithPermission>
            </div>
        </div>
    )
}

export default Cart
