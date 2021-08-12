import React from 'react'
import { Input, Empty, Button, Avatar, Form, Modal, Spin } from 'antd'
import { EditOutlined, SearchOutlined, CloseCircleOutlined, ShoppingFilled, PlusOutlined } from '@ant-design/icons'
import Utils from '../../utils'
import ElementWithPermission from '../common/elements/ElementWithPermission'
import { sitePathConfig } from '../../constants/sitePathConfig'

const { TextArea } = Input

const Cart = ({
    selectedItems,
    handleEventOnItem,
    handleRemoveSelectingItem,
    totalPrice,
    setIsPaymenting,
}) => {

    const handleSubmitNote = (values, product) => {
        handleEventOnItem({
            ...product,
            note: values["textarea-" + product.id]
        }, "submitNote")
    }
    return (
        <div className="cart">
            <div className="header">
                <h2>Giỏ hàng</h2>
            </div>
            <div className="list">
                <ul className="orders">
                    {
                        selectedItems.length > 0
                        ? selectedItems.sort((a, b) => a.order - b.order).map(product => {
                            return (<li key={product.id} className="item">
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
                                            <CloseCircleOutlined
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
                <div className="calculate-total">
                    <div className="title">Tổng tiền</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice)}
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
