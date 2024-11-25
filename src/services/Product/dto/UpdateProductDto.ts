export interface UpdateProductDto {
    readonly name?: string;
    readonly code?: string;
    readonly price?: number;
    readonly categoryId?: number;
    readonly sizeId?: number;
    readonly stockInventory?: number;
    readonly stockStore?: number;
    readonly location: LocationDto[];
}


export interface LocationDto {

    readonly row: number;
  
    readonly column: number;
  
    readonly warehouseId: number;
  
    readonly quantity: number;
  }
  