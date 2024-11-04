'use client'
import React from 'react';
import {ProductContextType} from "@/@types/product";
import {ProductDto} from "@/services/Dto/ProductDto";
import {ProductService} from "@/services/Product/ProductService";
import {CreateProductDto} from "@/services/Product/dto/CreateProductDto";
import {ProductActionType, productReducer, ProductState} from "@/context/ProductContext/productReducer";
import {AxiosError} from "axios";
import {UpdateProductDto} from "@/services/Product/dto/UpdateProductDto";

export const ProductContext = React.createContext<ProductContextType | null>(null);

const productService = new ProductService();

const ProductProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, dispatch] = React.useReducer(productReducer, {products: []} as ProductState);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                await getProducts();
            } catch (e) {
                console.error("Error loading products:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const getProducts = async (): Promise<void> => {
        try {
            const products = await productService.getAll();
            dispatch({type: ProductActionType.LOAD_PRODUCTS, payload: products});
        } catch (e) {
            handleError(e);
        }
    };

    const createProduct = async (product: CreateProductDto): Promise<void> => {
        try {
            const res = await productService.create(product);
            dispatch({type: ProductActionType.ADD_PRODUCT, payload: res});
        } catch (e) {
            handleError(e);
        }
    };

    const updateProduct = async (id: number, product: UpdateProductDto): Promise<void> => {
        try {
            const res = await productService.updateById(id, product);
            dispatch({type: ProductActionType.EDIT_PRODUCT, payload: res});
        } catch (e) {
            handleError(e);
        }
    };

    const getProduct = async (id: number): Promise<ProductDto> => {
        try {
            return await productService.getById(id);
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const deleteProduct = async (id: number): Promise<void> => {
        try {
            await productService.deleteById(id);
            dispatch({type: ProductActionType.REMOVE_PRODUCT, payload: id});
        } catch (e) {
            handleError(e);
        }
    };

    const values = React.useMemo(() => ({
        products: state.products,
        createProduct,
        updateProduct,
        deleteProduct,
        getProducts,
        loading,
        getProduct,
        error
    }), [state.products, loading, error]);

    return (
        <ProductContext.Provider value={values}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;
