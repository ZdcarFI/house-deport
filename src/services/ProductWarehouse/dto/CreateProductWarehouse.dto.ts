export interface CreateProductWarehouseDto{

  readonly productId: number;

  readonly warehouseId: number;

  readonly quantity: number;

  readonly row: number;

  readonly column: number;
}