import { CategoryDto } from "./CategoryDto";
import { SizeDto } from "./SizeDto";


export interface ProductWarehouseBasicDto {
    readonly id: number;
    readonly row: number;
    readonly column: number;
    readonly quantity: number;
    readonly name: string;
    readonly status: string;
    readonly warehouseId: number;
}

export interface ProductDto {
    readonly id: number;
    readonly name: string;
    readonly code: string;
    readonly price: number;
    readonly category: CategoryDto;
    readonly size: SizeDto;
    readonly productWarehouse: ProductWarehouseBasicDto[];
    readonly stockInventory: number;
    readonly stockStore: number;
}

