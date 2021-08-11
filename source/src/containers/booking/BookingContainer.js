import React, { useEffect } from 'react'
import BookingPage from '../../compoments/booking/BookingPage'

const BookingContainer = ({
    changeBreadcrumb,
}) => {
    const breadcrumbs = [{ name: "Đặt hàng" }]

    useEffect(() => {
        if(breadcrumbs.length > 0) {
            changeBreadcrumb(breadcrumbs);
        }
    }, [])

    const productsData = [
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
        {
            productName: 'Cà Phê Sen Vàng Hạnh Nhân Đá Xay',
            productPrice: 100000,
            productImage: '/AVATAR/AVATAR_4qFPo15zP4.'
        },
    ]

    return (
        <div className="booking-container">
            <BookingPage
                products={productsData}
            />
        </div>
    )
}

export default BookingContainer
