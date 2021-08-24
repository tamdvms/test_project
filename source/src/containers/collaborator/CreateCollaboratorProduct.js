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
    collaboratorProducts,
    fetchCollaboratorsProductList,
}) => {

    // TODO Fix how implement interface obj 
    // TODO -> change array to obj with some static value and dynamic mapping property name if can
    const createFormFields = ['kind', 'value']
    const updateFormFields = ['id', 'kind', 'value', 'status'] // TODO fix this
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

    const fetchAutoCompleteProducts = () => {
        setListLoading(true)
        dispatch(actions.getProductAutoComplete({
            onCompleted: (data = []) => {
                const products = data.map(d => ({...d, key: d.id}))
                setProducts(products)
                setListLoading(false)
            },
        }))
    }

    /**
     * TODO Fix bug search
     * @param {*} direction 
     * @param {*} value 
     */
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

    const filterObjByObjInterface = (obj = {}, objInterface = []) => {
        return objInterface
                .reduce((acc, cur) => ({
                    ...acc,
                    [cur]: obj[cur]
                }), {})
    }

    // TODO Test
    const prepareCreateData = (formValues) => {
        return products
        .filter(product => selectedKeysInTargets.includes(product.id))
        .map(product => ({
            collaboratorId,
            productId: product.id,
            ...filterObjByObjInterface({ ...product, ...formValues }, createFormFields),
        }))
    }

    // TODO Test
    const sendCreatingRequest = (formValues) => {
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

    // TODO Fix
    const prepareUpdateData = (formValues) => {
        return products
        .filter(product => selectedKeysInTargets.includes(product.id))
        .map(product => ({
            ...filterObjByObjInterface({ ...product, ...formValues }, updateFormFields),
        }))
    }

    // TODO Fix update function in saga
    const sendUpdatingRequest = (formValues) => {
        setFormLoading(true)
        dispatch(actions.updateCollaboratorProduct({
            params: {
                collaboratorProducts: prepareUpdateData(formValues)
            },
            onCompleted: () => {
                setFormLoading(false)
                fetchCollaboratorsProductList()
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

    // TODO Continue
    const handleOkeEditForm = (formValues) => {
        if(editingMode) {
            // ** Mode updating even could create new data if any,
            // ** so need to classify data
            sendUpdatingRequest(formValues)
            // sendCreatingRequest(formValues)
        }
        else {
            sendCreatingRequest(formValues)
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
            const cllProduct = collaboratorProducts.find(cllProduct => cllProduct.productDto.id === product.id)
            return {
                ...product,
                ...filterObjByObjInterface(cllProduct),
            }
        })
    }

    const mergeTargetKeysWithNewOne = (targetKeysDataList) => {
        return [...new Set([...targetKeys ,...targetKeysDataList])]
    }

    const handleMergeCurrentDataWithDataList = () => {
        const newProducts = mergeAutoCompleteWithDataList(products)
        setProducts(newProducts)
        setTargetKeys(
            mergeTargetKeysWithNewOne(
                newProducts
                .filter(product => product.kind && product.value)
                .map(product => product.id)
            )
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
                ...filterObjByObjInterface(product)
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

    useEffect(() => {
        fetchAutoCompleteProducts()
    }, [])

    useEffect(() => {
        buildIndex(products)
    }, [products])

    /**
     * Decision edit or create mode
     */
    useEffect(() => {
        setEditingMode(selectedKeysInTargets.length > 0
            && !products.filter(product => selectedKeysInTargets.includes(product.id))
                        .some(product => !product.kind))
    }, [selectedKeysInTargets])

    useEffect(() => {
        products.length > 0
        && collaboratorProducts
        && collaboratorProducts.length > 0
        && handleMergeCurrentDataWithDataList()
    }, [collaboratorProducts, JSON.stringify(products)])

    return (<>
        <CreateCollaboratorProductPage
        products={products}
        targetKeys={targetKeys}
        matchingSearchProducts={matchingSearchProducts}
        selectedKeysInTargets={selectedKeysInTargets}
        isEditing={editingMode}
        transferRef={transferRef}
        listLoading={listLoading}
        handleBack={handleBack}
        handleChangeSelectedKeysInTargets={handleChangeSelectedKeysInTargets}
        handleMoveProduct={handleMoveProduct}
        handleSearchProduct={handleSearchProduct}
        handleShowEditForm={handleShowEditForm}
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