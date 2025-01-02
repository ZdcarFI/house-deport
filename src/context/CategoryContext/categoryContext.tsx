"use client"

import React, { useCallback, useState, useReducer, useEffect, useMemo } from "react"
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
const categoryInitialState: CategoryDto = {
    id: 0,
    name: '',
    sizes: [],
    created_at: new Date(),
    updated_at: new Date(),
};

const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(categoryReducer, { categories: [] } as CategoryState)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
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
            setSelectedCategory(categoryInitialState);
        } catch (e) {
            handleError(e)
        }
    }

    const updateCategory = async (id: number, category: UpdateCategoryDto): Promise<void> => {
        try {
            const res = await categoryService.updateById(id, category);
            dispatch({ type: CategoryActionType.EDIT_CATEGORY, payload: res });
            setSelectedCategory(null);
        } catch (e) {
            handleError(e);
        }
    };

    const getCategory = async (id: number): Promise<CategoryDto> => {
        try {
            return await categoryService.getById(id)
        } catch (e) {
            handleError(e)
            throw e
        }
    }

    const deleteCategory = async (id: number): Promise<boolean> => {
        const response = await categoryService.deleteById(id)
        dispatch({ type: CategoryActionType.REMOVE_CATEGORY, payload: id })
        return response;
    }

    const updateCategoryWithNewSize = (categoryId: number, newSize: SizeDto) => {
        dispatch({ type: CategoryActionType.UPDATE_CATEGORY_SIZE, payload: { categoryId, newSize } })
    }

    const openModal = useCallback((category: CategoryDto | null = null, viewMode: boolean = false) => {
        setSelectedCategory(category);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        setIsViewMode(false);
    }, []);

    const values = useMemo(() => ({
        categories: state.categories,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategories,
        loading,
        getCategory,
        error,
        updateCategoryWithNewSize,
        category: categoryInitialState,
        isModalOpen,
        selectedCategory,
        isViewMode,
        openModal,
        closeModal,
    }), [state.categories, loading, error, isModalOpen, selectedCategory, isViewMode, openModal, closeModal])

    return (
        <CategoryContext.Provider value={values}>
            {children}
        </CategoryContext.Provider>
    )
}

export default CategoryProvider

