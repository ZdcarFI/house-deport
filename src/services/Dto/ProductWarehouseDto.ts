import { ProductDto, ProductWarehouseBasicDto } from "./ProductDto";

export interface ProductWarehouseDto {

    readonly id: number;

    readonly warehouse: ProductWarehouseBasicDto;

    readonly product: ProductDto;

    readonly row: number;
  
    readonly column: number;

    readonly quantity: number;
  }
