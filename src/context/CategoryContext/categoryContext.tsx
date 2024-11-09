"use client"

import React from "react"
import { CategoryService } from "@/services/Category/CategoryService"
import { CategoryActionType, CategoryState, categoryReducer } from "./categoryReducer"
import { CategoryContextType } from "@/@types/category"
import { AxiosError } from "axios"
import { CreateCategoryDto } from "@/services/Category/dto/CreateCategoryDto"
import { UpdateCategoryDto } from "@/services/Category/dto/UpdateCategoryDto"
import { CategoryDto } from "@/services/Dto/CategoryDto"
import { SizeDto } from "@/services/Dto/SizeDto"

export const CategoryContext = React.createContext<CategoryContextType | null>(null)
const categoryService = new CategoryService()

const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(categoryReducer, { categories: [] } as CategoryState)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>('')
    const updateCategoryWithNewSize = (categoryId: number, newSize: SizeDto) => {
        dispatch({ type: CategoryActionType.UPDATE_CATEGORY_SIZE, payload: { categoryId, newSize } })
    }
    React.useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                await getCategories()
            } catch (e) {
                console.error("Error loading categories:", e)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message)
        } else {
            setError((e as Error).message)
        }
    }

    const getCategories = async (): Promise<void> => {
        try {
            const categories = await categoryService.getAll()
            dispatch({ type: CategoryActionType.LOAD_CATEGORIES, payload: categories })
        } catch (e) {
            handleError(e)
        }
    }

    const createCategory = async (category: CreateCategoryDto): Promise<void> => {
        try {
            const res = await categoryService.create(category)
            dispatch({ type: CategoryActionType.ADD_CATEGORY, payload: res })
        } catch (e) {
            handleError(e)
        }
    }

    const updateCategory = async (id: number, category: UpdateCategoryDto): Promise<void> => {
        try {
            const res = await categoryService.updateById(id, category)
            dispatch({ type: CategoryActionType.EDIT_CATEGORY, payload: res })
        } catch (e) {
            handleError(e)
        }
    }

    const getCategory = async (id: number): Promise<CategoryDto> => {
        try {
            return await categoryService.getById(id)
        } catch (e) {
            handleError(e)
            throw e
        }
    }

    const deleteCategory = async (id: number): Promise<void> => {
        try {
            await categoryService.deleteById(id)
            dispatch({ type: CategoryActionType.REMOVE_CATEGORY, payload: id })
        } catch (e) {
            handleError(e)
        }
    }

    const values = React.useMemo(() => ({
        categories: state.categories,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategories,
        loading,
        getCategory,
        error,
        updateCategoryWithNewSize
    }), [state.categories, loading, error])

    return (
        <CategoryContext.Provider value={values}>
            {children}
        </CategoryContext.Provider>
    )
}

export default CategoryProvider