import React from 'react'
import { Input, Empty, Avatar, Spin, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import Utils from '../../utils'
import { AppConstants } from '../../constants'
import Cart from './Cart'

const { confirm } = Modal

const BookingPage = ({
    itemList = [],
    selectedItems = [],
    isPaymenting,
    showingDescriptionList,
    setIsPaymenting,
    totalPrice,
    handleChangeSearchInput,
    handleEventOnItem,
    listLoading,
    handleSelectingItem,
    handleDeselectingItem,
}) => {

    const handleRemoveSelectingItem = (product) => {
        confirm({
            title: `Bạn có chắc muốn xóa sản phẩm này?`,
            content: '',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: () => {
                handleDeselectingItem(product)
            },
            onCancel() {
            },
          });
    }

    return (
        <div className="booking-page">
            <div className="content">
                <div className="auto-complete">
                    <Input
                        className="input"
                        placeholder="Nhập tên sản phẩm"
                        prefix={<SearchOutlined />}
                        onChange={handleChangeSearchInput}
                    />
                </div>
                <div className="list">
                    <ul className="products">
                        {
                            itemList.length > 0 ? (
                                itemList.map(product => {
                                    return (
                                        <li
                                        key={product.id}
                                        className="product-item"
                                        >
                                            <div
                                            className="overlay"
                                            onClick={() => handleSelectingItem(product)}></div>
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
                                listLoading
                                ? <Spin className="loading" spinning={listLoading}></Spin>
                                : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
                            )
                        }
                    </ul>
                </div>
            </div>
            <div className="sidebar">
                <Cart
                selectedItems={selectedItems}
                handleEventOnItem={handleEventOnItem}
                handleRemoveSelectingItem={handleRemoveSelectingItem}
                totalPrice={totalPrice}
                />
            </div>
        </div>
    )
}

export default BookingPage
