import { WarehouseDto } from "@/services/Dto/WarehouseDto";

export interface WarehouseState {
    warehouses: WarehouseDto[];
}

export enum WarehouseActionType {
    ADD_WAREHOUSE = "addWarehouse",
    REMOVE_WAREHOUSE = "removeWarehouse",
    EDIT_WAREHOUSE = "editWarehouse",
    LOAD_WAREHOUSES = "loadWarehouses",
}

export type WarehouseAction =
    | { type: WarehouseActionType.ADD_WAREHOUSE; payload: WarehouseDto }
    | { type: WarehouseActionType.REMOVE_WAREHOUSE; payload: number }
    | { type: WarehouseActionType.EDIT_WAREHOUSE; payload: WarehouseDto }
    | { type: WarehouseActionType.LOAD_WAREHOUSES; payload: WarehouseDto[]};

export const warehouseReducer = (state: WarehouseState, action: WarehouseAction): WarehouseState => {
    switch (action.type) {
        case WarehouseActionType.ADD_WAREHOUSE:
            return {
                ...state,
                warehouses: [...state.warehouses, action.payload],
            };
        case WarehouseActionType.REMOVE_WAREHOUSE:
            return {
                ...state,
                warehouses: state.warehouses.filter(
                    (warehouse) => warehouse.id !== action.payload
                ),
            };
        case WarehouseActionType.EDIT_WAREHOUSE:
            const updatedWarehouse = action.payload;

            const updatedWarehouses = state.warehouses.map((warehouse) => {
                if (warehouse.id === updatedWarehouse.id) {
                    return updatedWarehouse;
                }
                return warehouse;
            });

            return {
                ...state,
                warehouses: updatedWarehouses,
            };
        case WarehouseActionType.LOAD_WAREHOUSES:
            return {
                ...state,
                warehouses: action.payload,
            };
        default:
            return state;
    }
};