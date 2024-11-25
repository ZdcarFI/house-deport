"use client"

import React, { useCallback, useState } from "react"
import { ProductService } from "@/services/Product/ProductService"
import { ProductActionType, ProductState, productReducer } from "./productReducer"
import { ProductContextType } from "@/@types/product"
import { AxiosError } from "axios"
import { CreateProductDto } from "@/services/Product/dto/CreateProductDto"
import { UpdateProductDto } from "@/services/Product/dto/UpdateProductDto"
import { ProductDto } from "@/services/Dto/ProductDto"

export const ProductContext = React.createContext<ProductContextType | null>(null)
const productService = new ProductService()

const productInitialState: ProductDto = {
    id: 0,
    name: '',
    code: '',
    price: 0,
    stockInventory: 0,
    stockStore: 0,
    size: { id: 0, name: '' },
    category: { id: 0, name: '' },
    productWarehouse: []
};

const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(productReducer, { products: [] } as ProductState)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                await getProducts()
            } catch (e) {
                console.error("Error loading products:", e)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message)
        } else {
            setError((e as Error).message)
        }
    }

    const getProducts = async (): Promise<void> => {
        try {
            const products = await productService.getAll()
            dispatch({ type: ProductActionType.LOAD_PRODUCTS, payload: products })
        } catch (e) {
            handleError(e)
        }
    }

    const createProduct = async (product: CreateProductDto): Promise<void> => {
        try {
            const res = await productService.create(product)
            dispatch({ type: ProductActionType.ADD_PRODUCT, payload: res })
            setSelectedProduct(productInitialState);
        } catch (e) {
            handleError(e)
        }
    }

    const updateProduct = async (id: number, product: UpdateProductDto): Promise<void> => {
        try {
            const res = await productService.updateById(id, product)
            dispatch({ type: ProductActionType.EDIT_PRODUCT, payload: res })
            setSelectedProduct(productInitialState);
        } catch (e) {
            handleError(e)
        }
    }

    const getProduct = async (id: number): Promise<ProductDto> => {
        try {
            return await productService.getById(id)
        } catch (e) {
            handleError(e)
            throw e
        }
    }

    const deleteProduct = async (id: number): Promise<void> => {
        try {
            await productService.deleteById(id)
            dispatch({ type: ProductActionType.REMOVE_PRODUCT, payload: id })
        } catch (e) {
            handleError(e)
        }
    }

    const openModal = useCallback((product: ProductDto | null = null, viewMode: boolean = false) => {
        setSelectedProduct(product);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const openStockModal = useCallback((product: ProductDto) => {
        setSelectedProduct(product);
        setIsStockModalOpen(true);
    }, []);

    const closeStockModal = useCallback(() => {
        setIsStockModalOpen(false);
    }, []);

    const values = React.useMemo(() => ({
        products: state.products,
        createProduct,
        updateProduct,
        deleteProduct,
        getProducts,
        loading,
        getProduct,
        error,
        productInitial: productInitialState,
        isModalOpen,
        isStockModalOpen,
        selectedProduct,
        isViewMode,
        openModal,
        closeModal,
        openStockModal,
        closeStockModal,
    }), [state.products, loading, error, isModalOpen, isStockModalOpen, selectedProduct, isViewMode, openModal, closeModal, openStockModal, closeStockModal])

    return (
        <ProductContext.Provider value={values}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider

