import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Fuse from 'fuse.js'

import CreateCollaboratorProductPage from '../../compoments/collaboratorProduct/CreateCollaboratorProductPage'
import { actions } from '../../actions'

const CreateCollaboratorProduct = ({
    handleBack,
}) => {
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [products, setProducts] = useState([])
    const [targetKeys, setTargetKeys] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const [fuse, setFuse] = useState()
    const [matchingSearchProducts, setMatchingSearchProducts]=  useState([])

    const buildIndex = (data) => {
        setFuse(new Fuse(data, {
            includeScore: true,
            threshold: 0.4,
            keys: ["productName"]
        }))
    };

    const handleMoveProduct = (targetKeys, direction, moveKeys) => {
        setTargetKeys(targetKeys)
    }

    const fetchProducts = () => {
        setListLoading(true)
        dispatch(actions.getProductAutoComplete({
            onCompleted: (data = []) => {
                const products = data.map(d => ({...d, key: d.id}))
                buildIndex(products)
                setProducts(products)
                setListLoading(false)
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

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <CreateCollaboratorProductPage
        products={products}
        targetKeys={targetKeys}
        matchingSearchProducts={matchingSearchProducts}
        handleBack={handleBack}
        handleMoveProduct={handleMoveProduct}
        handleSearchProduct={handleSearchProduct}
        />
    )
}

export default CreateCollaboratorProduct