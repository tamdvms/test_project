import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import BookingPage from '../../compoments/booking/BookingPage'
import { actions } from '../../actions'

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
        const index = newSelectedItems.findIndex(item => item.id === product.id)
        newSelectedItems.splice(index, 1)
        setSelectedItems(newSelectedItems)
    }

    const handleEventOnItem = (product, eventName) => {
        const { events } = decideDataWillSend(product, eventName)
        const newSelectedItems = JSON.parse(JSON.stringify(selectedItems))
        for(let i = 0; i < newSelectedItems.length; i++) {
            if(newSelectedItems[i].id === product.id) {
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

    const fetchProductsList = () => {
        setListLoading(true)
        dispatch(actions.getProductAutoComplete({
            params: {
                name: searchInput,
            },
            onCompleted: (data = []) => {
                setListLoading(false)
                setItemList(data)
            },
        }))
    }

    useEffect(() => {
        if(breadcrumbs.length > 0) {
            changeBreadcrumb(breadcrumbs);
        }
    }, [])

    useEffect(() => {
        fetchProductsList()
    }, [searchInput])

    useEffect(() => {
        let total = 0
        selectedItems.forEach(item => {
            total += item.productPrice * item.quantity
        })
        setTotalPrice(total)
    }, [selectedItems])

    return (
        <div className="booking-container">
            <BookingPage
                listLoading={listLoading}
                itemList={itemList}
                selectedItems={selectedItems}
                isPaymenting={isPaymenting}
                handleEventOnItem={handleEventOnItem}
                setIsPaymenting={setIsPaymenting}
                totalPrice={totalPrice}
                handleChangeSearchInput={handleChangeSearchInput}
                handleSelectingItem={handleSelectingItem}
                handleDeselectingItem={handleDeselectingItem}
            />
        </div>
    )
}

export default BookingContainer
