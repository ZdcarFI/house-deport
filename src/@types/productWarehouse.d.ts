import { CreateProductWarehouseDto } from "@/services/ProductWarehouse/dto/CreateProductWarehouseDto";
import { UpdateProductWarehouseDto } from "@/services/ProductWarehouse/dto/UpdateProductWarehouseDto";
import { ProductWarehouseDto } from "@/services/Dto/ProductWarehouseDto";

export type ProductWarehouseContextType = {
    productWarehouses: ProductWarehouseDto[];
    createProductWarehouse: (productWarehouse: CreateProductWarehouseDto) => Promise<void>;
    updateProductWarehouse: (id: number, productWarehouse: UpdateProductWarehouseDto) => Promise<void>;
    deleteProductWarehouse: (id: number) => Promise<void>;
    getProductWarehouses: () => Promise<void>;
    getProductWarehouse: (id: number) => Promise<ProductWarehouseDto>;
    loading: boolean;
    error: string;
};