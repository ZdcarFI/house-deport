import { ProductBasicDto } from "./ProductBasic.dto";

interface WarehouseBasicDto {
  readonly id: number;
  readonly name: string;
  readonly rowMax: number;
  readonly columnMax: number;
  readonly status: string;
}

export interface ProductWarehouseDto {

  readonly id: number;
  readonly warehouse: WarehouseBasicDto;
  readonly product: ProductBasicDto;
  readonly row: number;
  readonly column: number;
  readonly quantity: number;
  readonly productId: number;
  readonly warehouseId: number;
  readonly created_at : Date;
  readonly updated_at : Date;
}
