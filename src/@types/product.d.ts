import {CreateProductDto} from "@/services/Product/dto/CreateProductDto";
import {UpdateProductDto} from "@/services/Product/dto/UpdateProductDto";
import {ProductDto} from "@/services/Dto/ProductDto";

export type ProductContextType = {
    products: ProductDto[];
    createProduct: (product: CreateProductDto) => Promise<void>;
    updateProduct: (id:number, product: UpdateProductDto) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProducts: () => Promise<void>;
    getProduct: (id: number) => Promise<ProductDto>;
    loading: boolean;
    error: string;
    productInitial: ProductDto;
};