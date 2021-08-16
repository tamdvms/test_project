import React, { useEffect } from "react";
import qs from 'query-string';
import { Avatar, Empty, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import BaseTable from "../../compoments/common/table/BaseTable";
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '../../constants';
import Utils from "../../utils";

const ProductChildList = ({
    dataList,
    loading,
    handleSelectItem,
    parentProduct,
    parentId,
    getDataList
}) => {

    useEffect(() => {
        if(parentProduct) {
            const params = { size: 100, parentId: parentProduct.id };
            getDataList({ params });
        }
    }, [parentProduct])

    return (
        <div className="product-child-list">
            <div className="list">
                <ul className="products">
                    {
                        !loading && dataList.length > 0 ? (
                            dataList.map(product => {
                                const saleoffPrice = product.productPrice - (product.productPrice * (product.saleoff / 100))
                                return (
                                    <li
                                    key={product.id}
                                    className="product-item"
                                    style={{ backgroundColor: product.labelColor }}
                                    >
                                        <div
                                        className="overlay"
                                        onClick={() => handleSelectItem({
                                            ...parentProduct,
                                            labelColor: '#ffffff00',
                                            ...product,
                                            productName: parentProduct.productName + " (" + product.productName + ")"
                                        })}></div>
                                        <Avatar
                                            className="avatar"
                                            src={product.productImage ? AppConstants.contentRootUrl + product.productImage : ''}
                                        />
                                        <div className="name">{product.productName}</div>
                                        <div className="price">
                                            {
                                                product.saleoff > 0 && !product.hasChild ? (
                                                    <div className="saleoff-price">
                                                        {Utils.formatMoney(saleoffPrice)}
                                                    </div>
                                                ) : null
                                            }
                                            <div className={`original-price${product.saleoff && !product.hasChild > 0 ? ' line-through' : ''}`}>
                                                {Utils.formatMoney(product.productPrice)}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        ) : (
                            loading
                            ? <Spin className="loading" spinning={loading}></Spin>
                            : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
                        )
                    }
                </ul>
            </div>
        </div>
    );
}

export default ProductChildList;
