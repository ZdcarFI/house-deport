import {CategoryBasicDto} from "./CategoryDto";
import { SizeDto } from "./SizeDto";



export enum Color {

    SUCCESS = 'success',

}

export interface ProductWarehouseBasicDto {
    readonly id: number;
    readonly row: number;
    readonly column: number;
    readonly quantity: number;
    readonly name: string;
    readonly status: string;
    readonly warehouseId: number;
    readonly color: Color;
}

export interface ProductDto {
    readonly id: number;
    readonly name: string;
    readonly code: string;
    readonly price: number;
    readonly category: CategoryBasicDto;
    readonly size: SizeDto;
    readonly productWarehouse: ProductWarehouseBasicDto[];
    readonly stockInventory: number;
    readonly stockStore: number;
    readonly created_at : Date;
    readonly updated_at : Date;
}
