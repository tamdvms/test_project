import React from 'react'
import { Input, Empty, Avatar, Spin, Modal, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import Utils from '../../utils'
import { AppConstants } from '../../constants'
import Cart from './Cart'
import Payment from './Payment'

const { confirm } = Modal

const BookingPage = ({
    itemList = [],
    selectedItems = [],
    isPaymenting,
    setIsPaymenting,
    totalPrice,
    handleChangeSearchInput,
    handleEventOnItem,
    listLoading,
    handleSelectingItem,
    handleDeselectingItem,
    handleChangeLoadMore,
    numLoadMore,
    loadmoreLoading,
    loadingSave,
    handleSubmitPayment,
    handleChangePhoneCustomer,
    customersList,
    listCustomerLoading,
    phoneInput,
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
    const loadMore = numLoadMore > 0 && !listLoading
        ? (
            <div className="load-more">
				<div
					className="loader-container"
					style={{
						textAlign: 'center',
						marginTop: 12,
						height: 32,
						lineHeight: '32px',
					}}
				>
					{
						loadmoreLoading
						? <div className="loader">Loading...</div>
						: <Button onClick={handleChangeLoadMore}>Xem thêm {numLoadMore} (sản phẩm)</Button>
					}
				</div>
			</div>
        ) : null;

    return (
        <div className="booking-page">
            <div className={`content${isPaymenting ? ' disabled' : ''}`}>
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
                            !listLoading && itemList.length > 0 ? (
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
                        {loadMore}
                    </ul>
                </div>
            </div>
            <div className="sidebar">
                <Payment
                hide={!isPaymenting}
                selectedItems={selectedItems}
                totalPrice={totalPrice}
                setIsPaymenting={setIsPaymenting}
                loadingSave={loadingSave}
                handleSubmitPayment={handleSubmitPayment}
                handleChangePhoneCustomer={handleChangePhoneCustomer}
                customersList={customersList}
                listCustomerLoading={listCustomerLoading}
                phoneInput={phoneInput}
                />
                <Cart
                hide={isPaymenting}
                selectedItems={selectedItems}
                handleEventOnItem={handleEventOnItem}
                handleRemoveSelectingItem={handleRemoveSelectingItem}
                totalPrice={totalPrice}
                setIsPaymenting={setIsPaymenting}
                />
            </div>
        </div>
    )
}

export default BookingPage
