import { CreateProductWarehouseDto } from "@/services/ProductWarehouse/dto/CreateProductWarehouseDto";
import { UpdateProductWarehouseDto } from "@/services/ProductWarehouse/dto/UpdateProductWarehouseDto";
import { ProductWarehouseDto } from "@/services/Dto/ProductWarehouseDto";
import { WarehouseDto } from "@/services/Dto/WarehouseDto";

export type ProductWarehouseContextType = {
    productWarehouses: ProductWarehouseDto[];
    createProductWarehouse: (productWarehouse: CreateProductWarehouseDto) => Promise<void>;
    updateProductWarehouse: (id: number, productWarehouse: UpdateProductWarehouseDto) => Promise<void>;
    deleteProductWarehouse: (id: number) => Promise<void>;
    getProductWarehouses: () => Promise<void>;
    getProductWarehouse: (id: number) => Promise<ProductWarehouseDto>;
    loading: boolean;
    error: string;
    productWarehouse: ProductWarehouseDto;
    isModalOpen: boolean;
    selectedProductWarehouse: ProductWarehouseDto | null;
    isViewMode: boolean;
    initialData: ProductDto | WarehouseDto | null;
    openModal: (productWarehouse: ProductWarehouseDto | null, viewMode: boolean, initialData?: ProductDto | WarehouseDto | null) => void;
    closeModal: () => void;
};

