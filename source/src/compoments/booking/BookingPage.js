import React from 'react'
import { Input, Empty, Avatar, Spin, Modal, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import BasicModal from '../common/modal/BasicModal'
import { useTranslation } from 'react-i18next'

import Utils from '../../utils'
import { AppConstants } from '../../constants'
import Cart from './Cart'
import Payment from './Payment'
import ProductChildList from './ProductChildList'

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
    productChildListData,
    getProductChildList,
    isShowModal,
    onCancelModal,
    currentProductParentProduct,
    tbProductChildLoading,
    handleOpenModal,
}) => {
    const { t } = useTranslation("bookingContainer")

    const handleRemoveSelectingItem = (product) => {
        confirm({
            title: t("page.confirm"),
            content: '',
            okText: t("page.yes"),
            okType: 'danger',
            cancelText: t("page.no"),
            onOk: () => {
                handleDeselectingItem(product)
            },
            onCancel() {
            },
          });
    }

    const handleSelectingChildItem = (product) => {
        handleSelectingItem(product)
        onCancelModal()
    }

    return (
        <div className="booking-page">
            <div className={`content${isPaymenting ? ' disabled' : ''}`}>
                <div className="auto-complete">
                    <Input
                        className="input"
                        placeholder={t("page.searchPlaceHolder")}
                        prefix={<SearchOutlined />}
                        onChange={handleChangeSearchInput}
                    />
                </div>
                <div className="list">
                    <ul className="products">
                        {
                            !listLoading && itemList.length > 0 ? (
                                itemList.map(product => {
                                    const saleoffPrice = product.productPrice - (product.productPrice * (product.saleoff / 100))
                                    return (
                                        <li
                                        key={product.id}
                                        className="product-item"
                                        style={{ backgroundColor: product.labelColor }}
                                        >
                                            <div
                                            className="overlay"
                                            onClick={() => product.hasChild ? handleOpenModal(product) : handleSelectingItem(product)}></div>
                                            <Avatar
                                                className="avatar"
                                                src={product.productImage ? AppConstants.contentRootUrl + product.productImage : ''}
                                            />
                                            <div className="name">{product.productName}</div>
                                            <div className="price">
                                                {
                                                    product.hasChild ? (
                                                        t("page.chooseCategory")
                                                    ) : (<>
                                                        {
                                                            product.saleoff > 0 ? (
                                                                <div className="saleoff-price">
                                                                    {Utils.formatMoney(saleoffPrice)}
                                                                </div>
                                                            ) : null
                                                        }
                                                        <div className={`original-price${product.saleoff ? ' line-through' : ''}`}>
                                                            {Utils.formatMoney(product.productPrice)}
                                                        </div>
                                                        </>
                                                    )
                                                }
                                            </div>
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
            <BasicModal
                maskClosable={true}
                className="product-child-list-modal"
                noFooter={true}
                closable={false}
                title={t("page.categoryList")}
				visible={isShowModal}
				onCancel={onCancelModal}
                width={600}
                centered={true}
			>
                <ProductChildList
                    dataList={productChildListData}
                    getDataList={getProductChildList}
                    loading={tbProductChildLoading}
                    handleSelectItem={handleSelectingChildItem}
                    parentProduct={currentProductParentProduct}
                />
            </BasicModal>
        </div>
    )
}

export default BookingPage
