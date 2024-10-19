interface CategoryBasicDto{
    id: number;
    name: string;
}

interface SizeBasicDto{
    id: number;
    name: string;
}

interface ProductWarehouseBasicDto{
    id: number;
    row: number;
    column: number;
    quantity: number;
    name: string;
    status: string;
}

export interface ProductDto {
    id: number;
    name: string;
    code: string;
    price: number;
    category: CategoryBasicDto;
    sizes: SizeBasicDto;
    productWarehouse: ProductWarehouseBasicDto;
    stockInventory: number;
    stockStore: number;
}