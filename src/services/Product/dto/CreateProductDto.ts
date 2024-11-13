
export interface LocationDto {

  readonly row: number;

  readonly column: number;

  readonly warehouseId: number;

  readonly quantity: number;
}

export interface CreateProductDto {

  readonly name: string;

  readonly code: string;

  readonly price: number;

  readonly categoryId: number;
 
  readonly sizeId: number;

  readonly location: LocationDto[];

  readonly stockInventory: number;
}
