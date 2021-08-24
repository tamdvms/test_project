import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Fuse from 'fuse.js'

import BookingPage from '../../compoments/booking/BookingPage'
import { actions } from '../../actions'
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService'

const DEFAULT_ITEM_SIZE = 20

const BookingContainer = ({
    changeBreadcrumb,
}) => {
    const dispatch = useDispatch()
    const breadcrumbs = [{ name: "Đặt hàng" }]
    const defaultAdditionalData = {
        isShowNote: false,
        quantity: 1,
        note: "",
        order: -1,
    }

    const [isPaymenting, setIsPaymenting] = useState(false)
    const [itemList, setItemList] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [searchInput, setSearchInput] = useState("")
    const [listLoading, setListLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [pagination, setPagination] = useState({
        size: DEFAULT_ITEM_SIZE,
        numLoadMore: DEFAULT_ITEM_SIZE,
    })
    const [loadmoreLoading, setLoadmoreLoading] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [phoneInput, setPhoneInput] = useState("")
    const [customersList, setCustomersList] = useState([])
    const [listCustomerLoading, setListCustomerLoading] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [productChildListData, setProductChildListData] = useState([])
    const [currentProductParentProduct, setCurrentProductParentProduct] = useState()
    const [tbProductChildLoading, setTbProductChildLoading] = useState(false)
    const [fuse, setFuse] = useState()

    const buildIndex = (data) => {
        setFuse(new Fuse(data, {
            includeScore: true,
            threshold: 0.2,
            keys: ["productName"]
        }))
    };

    const findMaxOrder = (arr) => {
        let max = arr[0].order;
        for (let val of arr) {
          if (val.order > max) {
            max = val.order;
          }
        }
        return max;
    }

    const getConfigDataHandleOnEvent = product => {
        return {
            toggleDescription: [
                {
                    label: "isShowNote",
                    value: true,
                }
            ],
            minusQuantity: [
                {
                    label: "quantity",
                    value: product.quantity > 0 ? product.quantity - 1 : 0,
                },
            ],
            plusQuantity: [
                {
                    label: "quantity",
                    value: product.quantity + 1,
                }
            ],
            submitNote: [
                {
                    label: "note",
                    value: product.note,
                },
                {
                    label: "isShowNote",
                    value: false,
                }
            ]
        }
    }

    const decideDataWillSend = (product, eventName) => {
        return {
            events: getConfigDataHandleOnEvent(product)[eventName]
        }
    }

    const handleSelectingItem = (product) => {
        const newSelectedItems = JSON.parse(JSON.stringify(selectedItems))
        const index = newSelectedItems.findIndex(item => {
            return item.id === product.id
        })
        const maxOrder = newSelectedItems.length > 0 ? findMaxOrder(newSelectedItems) : -1
        if(index > -1) {
            newSelectedItems[index].quantity += 1
        }
        else {
            product["order"] = (maxOrder >= newSelectedItems.length
                                ? maxOrder + 1
                                : newSelectedItems.length)
            newSelectedItems.push({
                ...defaultAdditionalData,
                ...product
            })
        }
        setSelectedItems(newSelectedItems)
    }

    const handleDeselectingItem = (product) => {
        const newSelectedItems = JSON.parse(JSON.stringify(selectedItems))
        const index = newSelectedItems.findIndex(item => {
            return item.id === product.id
        })
        newSelectedItems.splice(index, 1)
        setSelectedItems(newSelectedItems)
    }

    const handleEventOnItem = (product, eventName) => {
        const { events } = decideDataWillSend(product, eventName)
        const newSelectedItems = JSON.parse(JSON.stringify(selectedItems))
        for(let i = 0; i < newSelectedItems.length; i++) {
            if(product.id === newSelectedItems[i].id) {
                events.forEach(event => {
                    newSelectedItems[i][event.label] = event.value
                });
                setSelectedItems(newSelectedItems)
                break
            }
        }
    }

    const handleChangeSearchInput = (event) => {
        setSearchInput(event.target.value)
    }

    const fetchProductsList = (size) => {
        size ? setLoadmoreLoading(true) : setListLoading(true)
        dispatch(actions.getProductAutoComplete({
            params: {
                name: searchInput,
                size: size || pagination.size,
            },
            onCompleted: (data = [], newPagination) => {
                buildIndex(data)
                size ? setLoadmoreLoading(false) : setListLoading(false)
                setItemList(data)
                // setPagination(newPagination)
            },
            defaultItemSize: DEFAULT_ITEM_SIZE,
        }))
    }

    const handleChangeLoadMore = () => {
        fetchProductsList(pagination.size + pagination.numLoadMore)
    }

    const handleSubmitPayment = (values, cb) => {
        setLoadingSave(true)
        const ordersDetailDtos = selectedItems.map(item => ({
            name: item.productName,
            productId: item.id,
            note: item.note,
            amount: item.quantity,
        }))
        dispatch(actions.createOrders({
            params: {
                customerEmail: values.customerEmail,
                customerFullName: values.customerFullName,
                customerPhone: values.customerPhone,
                ordersAddress: values.customerAddress,
                ordersDocument: values.ordersDocument,
                ordersSaleOff: values.customerDiscount,
                ordersDetailDtos,
            },
            onCompleted: () => {
                setLoadingSave(false)
                setIsPaymenting(false)
                setSelectedItems([])
                setCustomersList([])
                showSucsessMessage("Đặt hàng thành công")
                cb(true)
            },
            onError: () => {
                setLoadingSave(false)
                showErrorMessage("Đặt hàng thất bại. Vui lòng thử lại!")
                cb(false)
            },
        }))
    }

    const handleChangePhoneCustomer = (value) => {
        setPhoneInput(value)
    }

    const fetchCustomerList = () => {
        setListCustomerLoading(true)
        dispatch(actions.getCustomerAutoComplete({
            params: {
                phone: phoneInput,
                size: 10
            },
            onCompleted: (data) => {
                setListCustomerLoading(false)
                setCustomersList(data)
            },
            onDone: () => {
                setListCustomerLoading(false)
            }
        }))
    }

    const fetchProductChildList = ({ params }) => {
        const { parentId } = params
        const childData = itemList.find(item => item.id === parentId)?.productChilds
        console.log(childData)
        Promise.resolve().then(() => {
            setIsShowModal(true)
            setProductChildListData(childData)
        })
    }

    const handleOpenModal = (parentProduct) => {
        Promise.resolve().then(() => {
            setIsShowModal(true)
            setCurrentProductParentProduct(parentProduct)
        })
    }

    const onCancelModal = () => {
        setIsShowModal(false)
    }

    useEffect(() => {
        if(breadcrumbs.length > 0) {
            changeBreadcrumb(breadcrumbs);
        }
        fetchProductsList()
    }, [])

    useEffect(() => {
        // fetchProductsList()
        const res = fuse && fuse.search(searchInput);
        if(!searchInput) {
            setItemList(fuse?._docs)
        }
        else {
            setItemList(res.map(e => {
                return e.item
            }))
        }
    }, [searchInput])

    useEffect(() => {
        let total = 0
        selectedItems.forEach(item => {
            const saleoffPrice = item.productPrice - (item.productPrice * (item.saleoff / 100))
            total += saleoffPrice * item.quantity
        })
        setTotalPrice(total)
    }, [selectedItems])

    useEffect(() => {
        phoneInput ? fetchCustomerList() : setCustomersList([])
    }, [phoneInput])

    return (
        <div className="booking-container">
            <BookingPage
                listLoading={listLoading}
                itemList={itemList}
                selectedItems={selectedItems}
                isPaymenting={isPaymenting}
                totalPrice={totalPrice}
                // numLoadMore={pagination.numLoadMore}
                loadmoreLoading={loadmoreLoading}
                loadingSave={loadingSave}
                customersList={customersList}
                listCustomerLoading={listCustomerLoading}
                phoneInput={phoneInput}
                isShowModal={isShowModal}
                productChildListData={productChildListData}
                currentProductParentProduct={currentProductParentProduct}
                tbProductChildLoading={tbProductChildLoading}
                handleEventOnItem={handleEventOnItem}
                setIsPaymenting={setIsPaymenting}
                handleChangeSearchInput={handleChangeSearchInput}
                handleSelectingItem={handleSelectingItem}
                handleDeselectingItem={handleDeselectingItem}
                handleChangeLoadMore={handleChangeLoadMore}
                handleSubmitPayment={handleSubmitPayment}
                handleChangePhoneCustomer={handleChangePhoneCustomer}
                getProductChildList={fetchProductChildList}
                onCancelModal={onCancelModal}
                handleOpenModal={handleOpenModal}
            />
        </div>
    )
}

export default BookingContainer
