import { ProductDto } from "@/services/Dto/ProductDto";
import { CreateProductDto } from "@/services/Product/dto/CreateProductDto";
import { UpdateProductDto } from "@/services/Product/dto/UpdateProductDto";

export type ProductContextType = {
    products: ProductDto[];
    createProduct: (product: CreateProductDto) => Promise<void>;
    updateProduct: (id: number, product: UpdateProductDto) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProducts: () => Promise<void>;
    getProduct: (id: number) => Promise<ProductDto>;
    loading: boolean;
    error: string;
    productInitial: ProductDto;
    isModalOpen: boolean;
    selectedProduct: ProductDto | null;
    isViewMode: boolean;
    openModal: (Product: ProductDto | null, viewMode: boolean) => void;
    closeModal: () => void;
    isStockModalOpen: boolean;
    openStockModal: (product: ProductDto) => void;
    closeStockModal: () => void;
};