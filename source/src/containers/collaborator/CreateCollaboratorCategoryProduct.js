import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Fuse from 'fuse.js'
import { Modal } from 'antd'

import CreateCollaboratorCategoryProductPage from '../../compoments/collaboratorCategoryProduct/CreateCollaboratorCategoryProductPage'
import { actions } from '../../actions'
import AddInfoProductForm from '../../compoments/collaboratorProduct/AddInfoProductForm'
import BasicModal from '../../compoments/common/modal/BasicModal'
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService'

const { confirm } = Modal

const CreateCollaboratorProduct = ({
    isEditing,
    handleBack,
    collaboratorCategoryId,
    collaboratorCategoryProducts,
    fetchCollaboratorCategoryProductList,
    collaboratorCategoryName,
}) => {

    const IformValues = {
        kind: null,
        value: null,
    }
    const ICreateFormFields = {
        collaboratorCategoryId, // Default
        productId: null,
        kind: null,
        value: null,
    }
    const IUpdateFormFields = {
        id: null,
        kind: null,
        value: null,
    }
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
    const [selectedKeysInLeft, setSelectedKeysInLeft] = useState([])
    const [editingMode, setEditingMode] = useState(isEditing)
    const [formLoading, setFormLoading] = useState(false)

    const buildIndex = (data) => {
        setFuse(new Fuse(data, {
            includeScore: true,
            threshold: 0.4,
            keys: ["productName"]
        }))
    }

    const handleMoveProduct = (targetKeys, direction, moveKeys) => {
        if(direction === 'left') {
            setSelectedKeysInTargets(moveKeys)
            transferRef.current.setStateKeys('right', [...moveKeys])
            confirm({
                title: `Bạn có chắc muốn xóa?`,
                content: '',
                okText: 'Có',
                okType: 'danger',
                cancelText: 'Không',
                onOk: () => {
                    handleDelete()
                },
                onCancel() {
                    // console.log('Cancel');
                },
            });
        }
        else {
            setEditingMode(false)
            setIsShowEditForm(true)
            setSelectedKeysInLeft(moveKeys)
            transferRef.current.setStateKeys('left', [...moveKeys])
        }
    }

    const fetchAutoCompleteProducts = () => {
        setListLoading(true)
        dispatch(actions.getProductAutoComplete({
            onCompleted: (products = []) => {
                setProducts(products.map(product => ({
                    ...product,
                    key: product.id,
                    productId: product.id,
                })))
                setListLoading(false)
            },
        }))
    }

    const handleSearchProduct = (direction, value) => {
        console.log({direction, value})
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


    const filterObjByObjInterface = (obj = {}, objInterface = {}) => {
        return Object.keys(objInterface)
                .reduce((acc, curKey) => ({
                    ...acc,
                    [curKey]: obj[curKey] || objInterface[curKey] // (Default value)
                }), {})
    }

    const prepareCreateData = (formValues, products) => {
        return products
        .filter(product => selectedKeysInLeft.includes(product.id))
        .map(product => ({
            ...filterObjByObjInterface({ ...product, ...formValues }, ICreateFormFields),
        }))
    }

    const sendCreatingRequest = (formValues, products = []) => {
        setFormLoading(true)
        products.length > 0
        && dispatch(actions.createCollaboratorCategoryProduct({
            params: {
                collaboratorCategoryProducts: prepareCreateData(formValues, products)
            },
            onCompleted: () => {
                setFormLoading(false)
                fetchCollaboratorCategoryProductList(1000)
                setIsShowEditForm(false)
                setEditingMode(true)
                setSelectedKeysInLeft([])
                transferRef.current.setStateKeys('left', [])
                showSucsessMessage('Thêm sản phẩm thành công!')
            },
            onError: (err) => {
                setFormLoading(false)
                showErrorMessage(err ? err.message : 'Đã xảy ra lỗi!')
            }
        }))
    }

    const prepareUpdateData = (formValues, products) => {
        return products
        .filter(product => selectedKeysInTargets.includes(product.id))
        .map(product => ({
            ...filterObjByObjInterface(formValues, IUpdateFormFields),
            id: product.collaboratorCategoryProductId
        }))
    }

    const sendUpdatingRequest = (formValues, products = []) => {
        setFormLoading(true)
        products.length > 0
        && dispatch(actions.updateCollaboratorCategoryProduct({
            params: {
                collaboratorCategoryProducts: prepareUpdateData(formValues, products)
            },
            onCompleted: () => {
                setFormLoading(false)
                fetchCollaboratorCategoryProductList(1000)
                setIsShowEditForm(false)
                setSelectedKeysInTargets([])
                transferRef.current.setStateKeys('right', [])
                showSucsessMessage('Cập nhật sản phẩm thành công!')
            },
            onError: (err) => {
                setFormLoading(false)
                showErrorMessage(err ? err.message : 'Đã xảy ra lỗi!')
            }
        }))
    }

    const handleOkeEditForm = (formValues) => {
        if(editingMode) {
            sendUpdatingRequest(formValues, products)
        }
        else {
            sendCreatingRequest(formValues, products)
        }
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
    const mergeAutoCompleteWithDataList = (products) => {
        return products.map(product => {
            const cllProduct = collaboratorCategoryProducts.find(cllProduct => cllProduct.productDto.id === product.id)
            const mappedProduct = {
                ...product,
                ...filterObjByObjInterface(cllProduct, IformValues),
            }
            if(cllProduct) {
                mappedProduct.collaboratorCategoryProductId = cllProduct.id
            }
            return mappedProduct
        })
    }

    const handleMergeCurrentDataWithDataList = () => {
        const newProducts = mergeAutoCompleteWithDataList(products)
        setProducts(newProducts)
        setTargetKeys(
            newProducts
            .filter(product => product.kind && product.value && product.collaboratorCategoryProductId)
            .map(product => product.id)
        )
    }

    /**
     * Decision dataDetail in editing mode
     * if selected products have same value => set this value to dataDetail
     * set null otherwise
     */
    const handleShowEditForm = () => {
        if(editingMode) {
            const selectedProducts = products.filter(product => selectedKeysInTargets.includes(product.id))
            .map(product => ({
                ...filterObjByObjInterface(product, IformValues)
            }))
            setDataDetail(
                selectedProducts.reduce((acc, cur) => {
                    Object.keys(acc).forEach(key => {
                        if(acc[key] !== cur[key]) acc[key] = null
                    })
                    return acc
                }, selectedProducts[0])
            )
        }
        setIsShowEditForm(true)
    }

    const prepareDeleteData = (products) => {
        return products
        .filter(product => selectedKeysInTargets.includes(product.id))
        .map(product => product.collaboratorCategoryProductId)
    }

    const handleDelete = () => {
        dispatch(actions.deleteCollaboratorCategoryProduct({
            params: prepareDeleteData(products),
            onCompleted: () => {
                fetchCollaboratorCategoryProductList(1000)
                setIsShowEditForm(false)
                setSelectedKeysInTargets([])
                transferRef.current.setStateKeys('right', [])
                showSucsessMessage('Xóa thành công!')
            },
            onError: (err) => {
                showErrorMessage(err ? err.message : 'Đã xảy ra lỗi!')
            }
        }))
    }

    useEffect(() => {
        fetchAutoCompleteProducts()
    }, [])

    useEffect(() => {
        buildIndex(products)
    }, [products])

    useEffect(() => {
        if(!isShowEditForm)
            setEditingMode(true)
    }, [selectedKeysInTargets])

    useEffect(() => {
        products.length > 0
        && collaboratorCategoryProducts
        && handleMergeCurrentDataWithDataList()
    }, [collaboratorCategoryProducts, JSON.stringify(products)])

    return (<>
        <CreateCollaboratorCategoryProductPage
        products={products}
        targetKeys={targetKeys}
        matchingSearchProducts={matchingSearchProducts}
        selectedKeysInTargets={selectedKeysInTargets}
        isEditing={editingMode}
        transferRef={transferRef}
        listLoading={listLoading}
        collaboratorName={collaboratorCategoryName}
        handleBack={handleBack}
        handleChangeSelectedKeysInTargets={handleChangeSelectedKeysInTargets}
        handleMoveProduct={handleMoveProduct}
        handleSearchProduct={handleSearchProduct}
        handleShowEditForm={handleShowEditForm}
        />
        <BasicModal
            className="collaborator-product-edit-form"
            title={editingMode ? "CHỈNH SỬA THÔNG TIN" : "THÊM SẢN PHẨM"}
			visible={isShowEditForm}
			onOk={handleOkeEditForm}
			onCancel={() => {
                setIsShowEditForm(false)
                setEditingMode(true)
            }}
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