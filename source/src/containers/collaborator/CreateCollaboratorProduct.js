import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Fuse from 'fuse.js'

import CreateCollaboratorProductPage from '../../compoments/collaboratorProduct/CreateCollaboratorProductPage'
import { actions } from '../../actions'
import AddInfoProductForm from '../../compoments/collaboratorProduct/AddInfoProductForm'
import BasicModal from '../../compoments/common/modal/BasicModal'
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService'

const CreateCollaboratorProduct = ({
    isEditing,
    handleBack,
    collaboratorId,
}) => {
    const transferRef = useRef()
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [products, setProducts] = useState([])
    const [targetKeys, setTargetKeys] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const [fuse, setFuse] = useState()
    const [matchingSearchProducts, setMatchingSearchProducts]=  useState([])
    const [isShowEditForm, setIsShowEditForm]=  useState(false)
    const [dataDetail, setDataDetail] = useState({})
    const [selectedKeysInTargets, setSelectedKeysInTargets] = useState([])
    const [editingMode, setEditingMode] = useState(isEditing)
    const [formLoading, setFormLoading] = useState(false)
    const [collaboratorProducts, setCollaboratorProducts] = useState([])

    const buildIndex = (data) => {
        setFuse(new Fuse(data, {
            includeScore: true,
            threshold: 0.4,
            keys: ["productName"]
        }))
    }

    const handleMoveProduct = (targetKeys, direction, moveKeys) => {
        setTargetKeys(targetKeys)
    }

    const fetchCollaboratorsProductList = () => {
        dispatch(actions.getCollaboratorProductList({
            params: {
                collaboratorId,
            },
            onCompleted: (data) => {
                setCollaboratorProducts(data || [])
            }
        }))
    }

    const fetchAutoCompleteProducts = () => {
        setListLoading(true)
        dispatch(actions.getProductAutoComplete({
            onCompleted: (data = []) => {
                const products = data.map(d => ({...d, key: d.id}))
                setProducts(products)
                buildIndex(products)
                dispatch(actions.getCollaboratorProductList({
                    params: {
                        collaboratorId,
                    },
                    onCompleted: (data = []) => {
                        setCollaboratorProducts(data)
                        setListLoading(false)
                    }
                }))
            },
        }))
    }

    const handleSearchProduct = (direction, value) => {
        const res = fuse && fuse.search(value)
        if(!value) {
            setMatchingSearchProducts(fuse?._docs)
        }
        else {
            setMatchingSearchProducts(res.map(e => {
                return e.item
            }))
        }
    }

    const prepareCreateData = (formValues) => {
        return products
        .filter(product => selectedKeysInTargets.includes(product.id))
        .map(product => ({
            collaboratorId,
            kind: formValues.kind,
            productId: product.id,
            value: formValues.value,
        }))
    }

    const handleOkeEditForm = (formValues) => {
        setFormLoading(true)
        dispatch(actions.createCollaboratorProduct({
            params: {
                collaboratorProducts: prepareCreateData(formValues)
            },
            onCompleted: () => {
                setFormLoading(false)
                fetchCollaboratorsProductList()
                setIsShowEditForm(false)
                setSelectedKeysInTargets([])
                transferRef.current.setStateKeys('right', [])
                showSucsessMessage('Thêm sản phẩm thành công!')
            },
            onError: (err) => {
                setFormLoading(false)
                showErrorMessage(err ? err.message : 'Đã xảy ra lỗi!')
            }
        }))
    }

    const handleChangeSelectedKeysInTargets = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeysInTargets(targetSelectedKeys)
    }

    /**
     ** This will return an array of
     ** merged autocomplete vs datalist
     * @param {*} formValues
     * @returns Array
     */
    const mergeAutoCompleteWithDataList = () => {
        return products.map(product => {
            const cllProduct = collaboratorProducts.find(cllProduct => cllProduct.productDto.id === product.id)
            return {
                ...product,
                kind: cllProduct?.kind,
                value: cllProduct?.value
            }
        })
    }

    const mergeTargetKeysWithNewOne = (targetKeysDataList) => {
        return [...new Set([...targetKeys ,...targetKeysDataList])]
    }

    const handleMergeCurrentDataWithDataList = () => {
        const newProducts = products.length > 0
        && collaboratorProducts.length > 0
        && mergeAutoCompleteWithDataList(products)
        if(newProducts) {
            setProducts(newProducts)
            setTargetKeys(
                mergeTargetKeysWithNewOne(
                    newProducts
                    .filter(product => product.kind && product.value)
                    .map(product => product.id)
                )
            )
        }
    }

    useEffect(() => {
        fetchAutoCompleteProducts()
    }, [])

    useEffect(() => {
        setEditingMode(selectedKeysInTargets.length > 0
            && !products.filter(product => selectedKeysInTargets.includes(product.id))
                        .some(product => !product.kind))
    }, [selectedKeysInTargets])

    useEffect(() => {
        handleMergeCurrentDataWithDataList()
    }, [collaboratorProducts])

    return (<>
        <CreateCollaboratorProductPage
        products={products}
        targetKeys={targetKeys}
        matchingSearchProducts={matchingSearchProducts}
        selectedKeysInTargets={selectedKeysInTargets}
        isEditing={editingMode}
        transferRef={transferRef}
        handleBack={handleBack}
        handleChangeSelectedKeysInTargets={handleChangeSelectedKeysInTargets}
        handleMoveProduct={handleMoveProduct}
        handleSearchProduct={handleSearchProduct}
        handleShowEditForm={() => setIsShowEditForm(true)}
        />
        <BasicModal
            className="collaborator-product-edit-form"
            title={editingMode ? "CHỈNH SỬA THÔNG TIN" : "THÊM THÔNG TIN"}
			visible={isShowEditForm}
			onOk={handleOkeEditForm}
			onCancel={() => setIsShowEditForm(false)}
            loading={formLoading}
			>
			<AddInfoProductForm
            isEditing={editingMode}
            dataDetail={dataDetail}
            />
		</BasicModal>
        </>
    )
}

export default CreateCollaboratorProduct