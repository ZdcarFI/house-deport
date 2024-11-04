import { CategoryDto } from "@/services/Dto/CategoryDto";
import { CreateCategoryDto } from "@/services/Category/dto/CreateCategoryDto";
import { UpdateCategoryDto } from "@/services/Category/dto/UpdateCategoryDto";

export type CategoryContextType = {
    categories: CategoryDto[];
    createCategory: (category: CreateCategoryDto) => Promise<void>;
    updateCategory: (id: number, category: UpdateCategoryDto) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
    getCategories: () => Promise<void>;
    getCategory: (id: number) => Promise<CategoryDto>;
    loading: boolean;
    error: string;
};