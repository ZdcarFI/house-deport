import { ProductDto, ProductWarehouseBasicDto } from "./ProductDto";
import { WarehouseDto } from "./WarehouseDto";

export interface ProductWarehouseDto {

    readonly id: number;

    readonly warehouse: WarehouseDto;

    readonly product: ProductDto;

    readonly row: number;
  
    readonly column: number;

    readonly quantity: number;
  }
