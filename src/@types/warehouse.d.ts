import { CreateWarehouseDto } from "@/services/Warehouse/dto/CreateWarehouseDto";
import { UpdateWarehouseDto } from "@/services/Warehouse/dto/UpdateWarehouseDto";
import { WarehouseDto } from "@/services/Dto/ClienDto";

export type WarehouseContextType = {
    warehouses: Product[];
    createWarehouse: (Warehouse: CreateWarehouseDto) => Promise<void>;
    updateWarehouse: (id:number, Warehouse: UpdateWarehouseDto) => Promise<void>;
    deleteWarehouse: (id: number) => Promise<void>;
    getWarehouses: () => Promise<void>;
    getWarehouse: (id: number) => Promise<WarehouseDto>;
    loading: boolean;
    error: string;
};