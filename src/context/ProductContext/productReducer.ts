import { ProductDto } from "@/services/Dto/ProductDto"

export interface ProductState {
    products: ProductDto[]
}

export enum ProductActionType {
    LOAD_PRODUCTS = 'LOAD_PRODUCTS',
    ADD_PRODUCT = 'ADD_PRODUCT',
    EDIT_PRODUCT = 'EDIT_PRODUCT',
    REMOVE_PRODUCT = 'REMOVE_PRODUCT'
}

type ProductAction =
    | { type: ProductActionType.LOAD_PRODUCTS; payload: ProductDto[] }
    | { type: ProductActionType.ADD_PRODUCT; payload: ProductDto }
    | { type: ProductActionType.EDIT_PRODUCT; payload: ProductDto }
    | { type: ProductActionType.REMOVE_PRODUCT; payload: number }

export const productReducer = (state: ProductState, action: ProductAction): ProductState => {
    switch (action.type) {
        case ProductActionType.LOAD_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }
        case ProductActionType.ADD_PRODUCT:
            return {
                ...state,
                products: [...state.products, action.payload]
            }
        case ProductActionType.EDIT_PRODUCT:
            return {
                ...state,
                products: state.products.map(product => 
                    product.id === action.payload.id ? action.payload : product
                )
            }
        case ProductActionType.REMOVE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(product => product.id !== action.payload)
            }
        default:
            return state
    }
}