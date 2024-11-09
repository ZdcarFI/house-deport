import {ProductWarehouseDto} from "@/services/Dto/ProductWarehouseDto";

export interface ProductWarehouseState {
  productWarehouses: ProductWarehouseDto[];
}

export enum ProductWarehouseActionType {
  ADD_PRODUCT_WAREHOUSE = "addProductWarehouse",
  REMOVE_PRODUCT_WAREHOUSE = "removeProductWarehouse",
  EDIT_PRODUCT_WAREHOUSE = "editProductWarehouse",
  LOAD_PRODUCT_WAREHOUSES = "loadProductWarehouses",
}

export type ProductWarehouseAction =
  | { type: ProductWarehouseActionType.ADD_PRODUCT_WAREHOUSE; payload: ProductWarehouseDto }
  | { type: ProductWarehouseActionType.REMOVE_PRODUCT_WAREHOUSE; payload: number }
  | { type: ProductWarehouseActionType.EDIT_PRODUCT_WAREHOUSE; payload: ProductWarehouseDto }
  | { type: ProductWarehouseActionType.LOAD_PRODUCT_WAREHOUSES; payload: ProductWarehouseDto[]};

export const productWarehouseReducer = (state: ProductWarehouseState, action: ProductWarehouseAction): ProductWarehouseState => {
  switch (action.type) {
    case ProductWarehouseActionType.ADD_PRODUCT_WAREHOUSE:
      return {
        ...state,
        productWarehouses: [...state.productWarehouses, action.payload],
      };
    case ProductWarehouseActionType.REMOVE_PRODUCT_WAREHOUSE:
      return {
        ...state,
        productWarehouses: state.productWarehouses.filter(
          (productWarehouse) => productWarehouse.id !== action.payload
        ),
      };
    case ProductWarehouseActionType.EDIT_PRODUCT_WAREHOUSE:
      const updatedProductWarehouse = action.payload;
      const updatedProductWarehouses = state.productWarehouses.map((productWarehouse) => {
        if (productWarehouse.id === updatedProductWarehouse.id) {
          return updatedProductWarehouse;
        }
        return productWarehouse;
      });
      return {
        ...state,
        productWarehouses: updatedProductWarehouses,
      };
    case ProductWarehouseActionType.LOAD_PRODUCT_WAREHOUSES:
      return {
        ...state,
        productWarehouses: action.payload,
      };
    default:
      return state;
  }
};