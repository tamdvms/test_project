import React from 'react'
import TableTransfer from './TableTransfer'
import { AppConstants } from '../../constants'
import { Avatar } from 'antd'
import { COLLABORATOR_PRODUCT_KIND_MONEY } from '../../constants/masterData'
import Utils from '../../utils'

const DEFAULT_ITEM_SIZE = 20

function CreateCollaboratorProductPage({
    products = [],
    targetKeys = [],
    matchingSearchProducts = [],
    handleBack,
    handleMoveProduct,
    handleSearchProduct,
}) {

    const renderItem = (item) => {
        return (
            <div key={item.id} className="item" style={{backgroundColor: item.labelColor}}>
                {item.productName}
            </div>
        )
    }

    const handleFilterOption = (inputValue, item) => {
        return !!matchingSearchProducts.find(product => product.id === item.id)
    }

    const rightTableColumns = [
        {
            title: "Hình",
            dataIndex: "productImage",
            width: 80,
            align: 'center',
            render: (productImage, dataRow) => {
                return {
                    props: {
                        style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                    },
                    children: (
                        <Avatar
                            size="small"
                            src={productImage ? `${AppConstants.contentRootUrl}${productImage}` : null}
                        />
                    ),
                }
            }
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "productName",
            render: (productName, dataRow) => {
                return {
                    props: {
                        style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                    },
                    children: (
                        <div>{productName}</div>
                    ),
                }
            }
        },
        {
            title: <div className="tb-al-r">Hoa hồng</div>,
            dataIndex: "value",
            width: "100px",
            align: 'right',
            render: (value, dataRow) => {
                const _value = dataRow.kind === COLLABORATOR_PRODUCT_KIND_MONEY
                ? Utils.formatMoney(value)
                : value ? value + '%' : '---'
                return {
                    props: {
                        style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                    },
                    children: (
                        <div className="tb-al-r">
                            {_value}
                        </div>
                    ),
                }
            }
        },
    ];

    const leftTableColumns = [
        { ...rightTableColumns[0] },
        { ...rightTableColumns[1] }
    ];

    return (
        <div className="container">
            <TableTransfer
                titles={['Danh sách sản phẩm', 'Đã chọn']}
                dataSource={products.map(e => ({...e, key: e.id}))}
                targetKeys={targetKeys}
                showSearch
                filterOption={(inputValue, item) => handleFilterOption(inputValue, item)}
                onSearch={(direction, value) => handleSearchProduct(direction, value)}
                onChange={handleMoveProduct}
                leftColumns={leftTableColumns}
                rightColumns={rightTableColumns}
                listStyle={{
                    flex: 1,
                    height: 'unset',
                }}
                locale={{
                    searchPlaceholder: 'Tìm tại đây',
                    itemUnit: 'sản phẩm',
                    itemsUnit: 'sản phẩm',
                    remove: 'Xóa',
                    selectAll: 'Chọn tất cả',
                    selectCurrent: 'Chọn hiện tại',
                    selectInvert: 'Chọn ngược lại',
                    removeAll: 'Xóa tất cả',
                    removeCurrent: 'Xóa hiện tại',
                }}
                pagination={{
                    pageSize: DEFAULT_ITEM_SIZE,
                }}
                showHeader={false}
            />
        </div>
    )
}

export default CreateCollaboratorProductPage
