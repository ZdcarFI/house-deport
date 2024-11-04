import {ProductDto} from "@/services/Dto/ProductDto";

export interface ProductState {
    products: ProductDto[];
}

export enum ProductActionType {
    ADD_PRODUCT = "addProduct",
    REMOVE_PRODUCT = "removeProduct",
    EDIT_PRODUCT = "editProduct",
    LOAD_PRODUCTS = "loadProducts",
}

export type ProductAction =
    | { type: ProductActionType.ADD_PRODUCT; payload: ProductDto }
    | { type: ProductActionType.REMOVE_PRODUCT; payload: number }
    | { type: ProductActionType.EDIT_PRODUCT; payload: ProductDto }
    | { type: ProductActionType.LOAD_PRODUCTS; payload: ProductDto[]};

export const productReducer = (state: ProductState, action: ProductAction): ProductState => {
    switch (action.type) {
        case ProductActionType.ADD_PRODUCT:
            return {
                ...state,
                products: [...state.products, action.payload],
            };
        case ProductActionType.REMOVE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(
                    (product) => product.id !== action.payload
                ),
            };
        case ProductActionType.EDIT_PRODUCT:
            const updatedProduct = action.payload;

            const updatedProducts = state.products.map((product) => {
                if (product.id === updatedProduct.id) {
                    return updatedProduct;
                }
                return product;
            });

            return {
                ...state,
                products: updatedProducts,
            };
        case ProductActionType.LOAD_PRODUCTS:
            return {
                ...state,
                products: action.payload,
            };
        default:
            return state;
    }
};