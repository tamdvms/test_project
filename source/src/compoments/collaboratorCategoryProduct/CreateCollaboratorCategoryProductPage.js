import React from 'react'
import TableTransfer from '../collaboratorProduct/TableTransfer'
import { AppConstants, STATUS_LOCK } from '../../constants'
import { Avatar, Button } from 'antd'
import { ArrowLeftOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import { COLLABORATOR_PRODUCT_KIND_MONEY } from '../../constants/masterData'
import Utils from '../../utils'
import StatusTag from '../common/elements/StatusTag'

function CreateCollaboratorCategoryProductPage({
    products = [],
    targetKeys = [],
    matchingSearchProducts = [],
    selectedKeysInTargets = [],
    isEditing,
    transferRef,
    listLoading,
    handleBack,
    handleMoveProduct,
    handleSearchProduct,
    handleShowEditForm,
    handleChangeSelectedKeysInTargets,
    collaboratorName,
}) {

    const { t } = useTranslation("collaboratorCategoryProductListPage")
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
            title: "#",
            dataIndex: "productImage",
            width: 55,
            align: 'center',
            render: (productImage, dataRow) => {
                return {
                    props: {
                        style: {
                            background: dataRow.labelColor === 'none' ? '' : dataRow.labelColor,
                        }
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
            title: t("table.productName"),
            dataIndex: "productName",
            render: (productName, dataRow) => {
                return {
                    props: {
                        style: {
                            background: dataRow.labelColor === 'none' ? '' : dataRow.labelColor,
                            textDecoration: dataRow.status === STATUS_LOCK ? 'line-through' : 'none'
                        }
                    },
                    children: (
                        <div>{productName}</div>
                    ),
                }
            }
        },
        {
            title: <div className="tb-al-r">{t("table.commission")}</div>,
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
                        <div className="tb-al-r force-one-line">
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

    const EditButton = (<Button
        className="btn-edit"
        onClick={handleShowEditForm}
        disabled={selectedKeysInTargets.length <= 0}
        type="primary"
        >
            {
                <><EditOutlined /> {t("table.edit")} </>
            }
        </Button>)

    return (
        <div className="container">
            <div className="action">
                <Button
                className="btn-back"
                onClick={handleBack}
                type="primary"
                >
                    <ArrowLeftOutlined /> {t("table.back")}
                </Button>
                <h2>
                    {collaboratorName}
                </h2>
            </div>
            <TableTransfer
                transferRef={transferRef}
                titles={[t("table.productList"), EditButton]}
                dataSource={products.map(e => ({...e, key: e.id}))}
                targetKeys={targetKeys}
                showSearch
                leftColumns={leftTableColumns}
                rightColumns={rightTableColumns}
                loading={listLoading}
                listStyle={{
                    flex: 1,
                    height: '100%',
                }}
                locale={{
                    searchPlaceholder: t("table.searchPlaceHolder"),
                    itemUnit: t("table.product"),
                    itemsUnit: t("table.product"),
                    remove: t("table.delete"),
                    selectAll: t("table.selectAll"),
                    selectCurrent: t("table.selectCurrent"),
                    selectInvert: t("table.selectInvert"),
                    removeAll: t("table.removeAll"),
                    removeCurrent: t("table.removeCurrent"),
                }}
                showHeader={false}
                pagination={false}
                selectionWidth={46}
                filterOption={(inputValue, item) => handleFilterOption(inputValue, item)}
                onSearch={(direction, value) => handleSearchProduct(direction, value)}
                onChange={handleMoveProduct}
                onSelectChange={handleChangeSelectedKeysInTargets}
            />
        </div>
    )
}

export default CreateCollaboratorCategoryProductPage
