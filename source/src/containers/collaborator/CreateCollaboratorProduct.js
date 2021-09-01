import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Fuse from 'fuse.js'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'

import CreateCollaboratorProductPage from '../../compoments/collaboratorProduct/CreateCollaboratorProductPage'
import { actions } from '../../actions'
import AddInfoProductForm from '../../compoments/collaboratorProduct/AddInfoProductForm'
import BasicModal from '../../compoments/common/modal/BasicModal'
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService'
import { categoryKinds } from '../../constants/masterData'

const { CATEGORY_KIND_COLLABORATOR } = categoryKinds
const { confirm } = Modal

const CreateCollaboratorProduct = ({
    isEditing,
    handleBack,
    collaboratorId,
    collaboratorProducts,
    fetchCollaboratorsProductList,
    collaboratorName,
}) => {
    const { t } = useTranslation("collaboratorProductListPage")
    const IformValues = {
        kind: null,
        value: null,
    }
    const ICreateFormFields = {
        collaboratorId, // Default
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
    const [collaboratorCategoryList, setCollaboratorCategoryList] = useState([])
    const [collaboratorCategoryProductListLoading, setCollaboratorCategoryProductListLoading] = useState(false)

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
                title: t("createPage.confirmDelete"),
                content: '',
                okText: t("createPage.yes"),
                okType: 'danger',
                cancelText: t("createPage.no"),
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
        && dispatch(actions.createCollaboratorProduct({
            params: {
                collaboratorProducts: prepareCreateData(formValues, products)
            },
            onCompleted: () => {
                setFormLoading(false)
                fetchCollaboratorsProductList(1000)
                setIsShowEditForm(false)
                setEditingMode(true)
                setSelectedKeysInLeft([])
                transferRef.current.setStateKeys('left', [])
                showSucsessMessage(t("showSuccessMessage.add"), { t, ns: 'listBasePage' })
            },
            onError: (err) => {
                setFormLoading(false)
                showErrorMessage(err ? err.message : t("showErrorMessage.add"), { t, ns: 'listBasePage' })
            }
        }))
    }

    const prepareUpdateData = (formValues, products) => {
        return products
        .filter(product => selectedKeysInTargets.includes(product.id))
        .map(product => ({
            ...filterObjByObjInterface(formValues, IUpdateFormFields),
            id: product.collaboratorProductId
        }))
    }

    const sendUpdatingRequest = (formValues, products = []) => {
        setFormLoading(true)
        products.length > 0
        && dispatch(actions.updateCollaboratorProduct({
            params: {
                collaboratorProducts: prepareUpdateData(formValues, products)
            },
            onCompleted: () => {
                setFormLoading(false)
                fetchCollaboratorsProductList(1000)
                setIsShowEditForm(false)
                setSelectedKeysInTargets([])
                transferRef.current.setStateKeys('right', [])
                showSucsessMessage(t("showSuccessMessage.update"), { t, ns: 'listBasePage' })
            },
            onError: (err) => {
                setFormLoading(false)
                showErrorMessage(err ? err.message : t("showErrorMessage.add"), { t, ns: 'listBasePage' })
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
            const cllProduct = collaboratorProducts.find(cllProduct => cllProduct.productDto.id === product.id)
            const mappedProduct = {
                ...product,
                ...filterObjByObjInterface(cllProduct, IformValues),
            }
            if(cllProduct) {
                mappedProduct.collaboratorProductId = cllProduct.id
            }
            return mappedProduct
        })
    }

    const handleMergeCurrentDataWithDataList = () => {
        const newProducts = mergeAutoCompleteWithDataList(products)
        setProducts(newProducts)
        setTargetKeys(
            newProducts
            .filter(product => product.kind && product.value && product.collaboratorProductId)
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
        .map(product => product.collaboratorProductId)
    }

    const handleDelete = () => {
        setListLoading(true)
        dispatch(actions.deleteCollaboratorProduct({
            params: prepareDeleteData(products),
            onCompleted: () => {
                setListLoading(false)
                fetchCollaboratorsProductList(1000)
                setIsShowEditForm(false)
                setSelectedKeysInTargets([])
                transferRef.current.setStateKeys('right', [])
                showSucsessMessage(t("showSuccessMessage.delete"), { t, ns: 'listBasePage' })
            },
            onError: (err) => {
                setListLoading(false)
                showErrorMessage(err ? err.message : t("showErrorMessage.add"), { t, ns: 'listBasePage' })
            }
        }))
    }

    const fetchCollaboratorCategory = () => {
        dispatch(actions.getCollaboratorCategoryList({
            params: {
                kind: CATEGORY_KIND_COLLABORATOR
            },
            onCompleted: (data) => {
                setCollaboratorCategoryList(data.map(d => ({
                    value: d.id,
                    label: d.categoryName
                })))
            }
        }))
    }

    const sendCreatingRequestWithMultipleFormValues = (collaboratorCategoryProducts = []) => {
        setCollaboratorCategoryProductListLoading(true)
        collaboratorCategoryProducts.length > 0
        && dispatch(actions.createCollaboratorProduct({
            params: {
                collaboratorProducts: collaboratorCategoryProducts,
            },
            onCompleted: () => {
                setCollaboratorCategoryProductListLoading(false)
                fetchCollaboratorsProductList(1000)
                setIsShowEditForm(false)
                setEditingMode(true)
                setSelectedKeysInLeft([])
                transferRef.current.setStateKeys('left', [])
                showSucsessMessage(t("showSuccessMessage.delete"), { t, ns: 'listBasePage' })
            },
            onError: (err) => {
                setCollaboratorCategoryProductListLoading(false)
                showErrorMessage(err ? err.message : t("showErrorMessage.add"), { t, ns: 'listBasePage' })
            }
        }))
    }

    const confirmCreatingCollaboratorProducts = (collaboratorCategoryProducts) => {
        confirm({
            title: t("createPage.confirmCreate", { var: collaboratorCategoryProducts.length }),
            content: '',
            okText: t("createPage.yes"),
            okType: 'danger',
            cancelText: t("createPage.no"),
            onOk: () => {
                const prepareCreateData = collaboratorCategoryProducts.map(collaboratorCategoryProduct => ({
                    //* No need formValues because in collaboratorCategoryProduct obj has contained formValues
                        ...filterObjByObjInterface({ ...collaboratorCategoryProduct, productId: collaboratorCategoryProduct.productDto.id }, ICreateFormFields),
                    }))
                sendCreatingRequestWithMultipleFormValues(prepareCreateData)
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    /**
     ** Find matching elements of collaborator category products array in products array
     * @param {Array} first
     * @param {Array} second
     * @returns Array of matching elements
     */
     const matchingCollaboratorCategoryProducts = (collaboratorCategoryProducts, products) => {
        return collaboratorCategoryProducts.filter(
            cllCateProduct => products.find(
                product => cllCateProduct.productDto.id === product.id
            )
        )
    }

    const getProductsInLeft = () => products.filter(product => !targetKeys.includes(product.id))

    const fetchCollaboratorCategoryProductList = (collaboratorCategoryId) => {
        setCollaboratorCategoryProductListLoading(true)
        dispatch(actions.getCollaboratorCategoryProduct({
            params: {
                collaboratorCategoryId,
            },
            onCompleted: (data) => {
                setCollaboratorCategoryProductListLoading(false)
                const needAddeds = matchingCollaboratorCategoryProducts(data, getProductsInLeft())
                if(needAddeds.length > 0) {
                    confirmCreatingCollaboratorProducts(needAddeds)
                }
            },
            onError: (err) => {
                setCollaboratorCategoryProductListLoading(false)
                showErrorMessage(err ? err.message : t("showErrorMessage.add"), { t, ns: 'listBasePage' })
            }
        }))
    }

    const handleSelectCollaborateCategory = (value) => {
        fetchCollaboratorCategoryProductList(value)
    }

    useEffect(() => {
        fetchAutoCompleteProducts()
        fetchCollaboratorCategory()
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
        && collaboratorProducts
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
        collaboratorName={collaboratorName}
        collaboratorCategoryList={collaboratorCategoryList}
        collaboratorCategoryProductListLoading={collaboratorCategoryProductListLoading}
        handleBack={handleBack}
        handleChangeSelectedKeysInTargets={handleChangeSelectedKeysInTargets}
        handleMoveProduct={handleMoveProduct}
        handleSearchProduct={handleSearchProduct}
        handleShowEditForm={handleShowEditForm}
        handleSelectCollaborateCategory={handleSelectCollaborateCategory}
        />
        <BasicModal
            className="collaborator-product-edit-form"
            title={editingMode ? t("form.titleUpdate") : t("form.titleAdd")}
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
            t={t}
            />
		</BasicModal>
        </>
    )
}

export default CreateCollaboratorProduct