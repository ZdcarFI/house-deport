import { CategoryDto } from "@/services/Dto/CategoryDto";

export interface CategoryState {
    categories: CategoryDto[];
}

export enum CategoryActionType {
    ADD_CATEGORY = "addCategory",
    REMOVE_CATEGORY = "removeCategory",
    EDIT_CATEGORY = "editCategory",
    LOAD_CATEGORIES = "loadCategories",
}

export type CategoryAction =
    | { type: CategoryActionType.ADD_CATEGORY; payload: CategoryDto }
    | { type: CategoryActionType.REMOVE_CATEGORY; payload: number }
    | { type: CategoryActionType.EDIT_CATEGORY; payload: CategoryDto }
    | { type: CategoryActionType.LOAD_CATEGORIES; payload: CategoryDto[] };

export const categoryReducer = (state: CategoryState, action: CategoryAction): CategoryState => {
    switch (action.type) {
        case CategoryActionType.ADD_CATEGORY:
            return {
                ...state,
                categories: [...state.categories, action.payload],
            };
        case CategoryActionType.REMOVE_CATEGORY:
            return {
                ...state,
                categories: state.categories.filter(
                    (category) => category.id !== action.payload
                ),
            };
        case CategoryActionType.EDIT_CATEGORY:
            const updatedCategory = action.payload;

            const updatedCategories = state.categories.map((category) => {
                if (category.id === updatedCategory.id) {
                    return updatedCategory;
                }
                return category;
            });

            return {
                ...state,
                categories: updatedCategories,
            };
        case CategoryActionType.LOAD_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
            };
        default:
            return state;
    }
};