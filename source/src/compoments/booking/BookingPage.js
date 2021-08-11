import React from 'react'
import { Input, Empty, Button, Avatar } from 'antd'
import { EditOutlined, SearchOutlined, CloseCircleOutlined, ShoppingFilled } from '@ant-design/icons'
import Utils from '../../utils'
import { AppConstants } from '../../constants'

const BookingPage = ({
    products = [],
}) => {
    return (
        <div className="booking-page">
            <div className="content">
                <div className="auto-complete">
                    <Input
                        className="input"
                        placeholder="Nhập tên sản phẩm"
                        prefix={<SearchOutlined />}
                    />
                </div>
                <div className="list">
                    <ul className="products">
                        {
                            products.length > 0 ? (
                                products.map(product => {
                                    return (
                                        <li key={product.id} className="product-item">
                                            <Avatar
                                                className="avatar"
                                                src={AppConstants.contentRootUrl + product.productImage}
                                            />
                                            <div className="name">{product.productName}</div>
                                            <div className="price">{Utils.formatMoney(product.productPrice)}</div>
                                        </li>
                                    )
                                })
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )
                        }
                    </ul>
                </div>
            </div>
            <div className="sidebar">
                <div className="header">
                    <h2>Giỏ hàng</h2>
                </div>
                <div className="list">
                    <ul className="orders">
                        <li className="item">
                            <div className="col col-1">
                                <p className="title">
                                    Cà Phê Sen Vàng Hạnh Nhân Đá Xay
                                </p>
                                <div className="action">
                                    <Button className="description-btn" type="ghost">Thêm mô tả<EditOutlined /></Button>
                                    <CloseCircleOutlined className="delete-btn"/>
                                </div>
                            </div>
                            <div className="col col-2">
                                <p className="price">
                                    {Utils.formatMoney(100000)}
                                </p>
                                <div className="quantity-edition">
                                    <Button className="minus">-</Button>
                                    <span className="quantity">3</span>
                                    <Button className="plus">+</Button>
                                </div>
                            </div>
                        </li>
                        <li className="item">
                            <div className="col col-1">
                                <p className="title">
                                    Cà Phê Sen Vàng Hạnh Nhân Đá Xay
                                </p>
                                <div className="action">
                                    <Button className="description-btn" type="ghost">Thêm mô tả<EditOutlined /></Button>
                                    <CloseCircleOutlined className="delete-btn"/>
                                </div>
                            </div>
                            <div className="col col-2">
                                <p className="price">
                                    {Utils.formatMoney(100000)}
                                </p>
                                <div className="quantity-edition">
                                    <Button className="minus">-</Button>
                                    <span className="quantity">3</span>
                                    <Button className="plus">+</Button>
                                </div>
                            </div>
                        </li>
                        <li className="item">
                            <div className="col col-1">
                                <p className="title">
                                    Cà Phê Sen Vàng Hạnh Nhân Đá Xay
                                </p>
                                <div className="action">
                                    <Button className="description-btn" type="ghost">Thêm mô tả<EditOutlined /></Button>
                                    <CloseCircleOutlined className="delete-btn"/>
                                </div>
                            </div>
                            <div className="col col-2">
                                <p className="price">
                                    {Utils.formatMoney(100000)}
                                </p>
                                <div className="quantity-edition">
                                    <Button className="minus">-</Button>
                                    <span className="quantity">3</span>
                                    <Button className="plus">+</Button>
                                </div>
                            </div>
                        </li>
                        <li className="item">
                            <div className="col col-1">
                                <p className="title">
                                    Cà Phê Sen Vàng Hạnh Nhân Đá Xay
                                </p>
                                <div className="action">
                                    <Button className="description-btn" type="ghost">Thêm mô tả<EditOutlined /></Button>
                                    <CloseCircleOutlined className="delete-btn"/>
                                </div>
                            </div>
                            <div className="col col-2">
                                <p className="price">
                                    {Utils.formatMoney(100000)}
                                </p>
                                <div className="quantity-edition">
                                    <Button className="minus">-</Button>
                                    <span className="quantity">3</span>
                                    <Button className="plus">+</Button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="bottom">
                    <div className="calculate-total">
                        <div className="title">Tổng tiền</div>
                        <div className="total">
                            {Utils.formatMoney(100000)}
                        </div>
                    </div>
                    <Button className="payment" type="primary">Thanh toán</Button>
                </div>
            </div>
        </div>
    )
}

export default BookingPage
