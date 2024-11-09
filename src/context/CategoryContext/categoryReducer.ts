import { CategoryDto } from "@/services/Dto/CategoryDto"
import { SizeDto } from "@/services/Dto/SizeDto";

export interface CategoryState {
    categories: CategoryDto[]
}

export enum CategoryActionType {
    LOAD_CATEGORIES = 'LOAD_CATEGORIES',
    ADD_CATEGORY = 'ADD_CATEGORY',
    EDIT_CATEGORY = 'EDIT_CATEGORY',
    REMOVE_CATEGORY = 'REMOVE_CATEGORY',
    UPDATE_CATEGORY_SIZE = 'UPDATE_CATEGORY_SIZE'
}

type CategoryAction =
    | { type: CategoryActionType.LOAD_CATEGORIES; payload: CategoryDto[] }
    | { type: CategoryActionType.ADD_CATEGORY; payload: CategoryDto }
    | { type: CategoryActionType.EDIT_CATEGORY; payload: CategoryDto }
    | { type: CategoryActionType.REMOVE_CATEGORY; payload: number }
    | { type: CategoryActionType.UPDATE_CATEGORY_SIZE; payload: { categoryId: number, newSize: SizeDto } }

export const categoryReducer = (state: CategoryState, action: CategoryAction): CategoryState => {
    switch (action.type) {
        case CategoryActionType.LOAD_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        case CategoryActionType.ADD_CATEGORY:
            return {
                ...state,
                categories: [...state.categories, action.payload]
            }
        case CategoryActionType.EDIT_CATEGORY:
            return {
                ...state,
                categories: state.categories.map(category =>
                    category.id === action.payload.id ? action.payload : category
                )
            }
        case CategoryActionType.REMOVE_CATEGORY:
            return {
                ...state,
                categories: state.categories.filter(category => category.id !== action.payload)
            }
        case CategoryActionType.UPDATE_CATEGORY_SIZE:
            return {
                ...state,
                categories: state.categories.map(category =>
                    category.id === action.payload.categoryId
                        ? { ...category, sizes: [...category.sizes, action.payload.newSize] }
                        : category
                )
            }
        default:
            return state
    }
}