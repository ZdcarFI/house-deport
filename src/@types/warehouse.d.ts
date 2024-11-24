import { WarehouseDto } from "@/services/Dto/WarehouseDto";
import { CreateWarehouseDto } from "@/services/Warehouse/dto/CreateWarehouseDto";
import { UpdateWarehouseDto } from "@/services/Warehouse/dto/UpdateWarehouseDto";


export type WarehouseContextType = {
    warehouses: WarehouseDto[];
    createWarehouse: (Warehouse: CreateWarehouseDto) => Promise<void>;
    updateWarehouse: (id: number, Warehouse: UpdateWarehouseDto) => Promise<void>;
    deleteWarehouse: (id: number) => Promise<void>;
    getWarehouses: () => Promise<void>;
    getWarehouse: (id: number) => Promise<WarehouseDto>;
    loading: boolean;
    error: string;
    warehouse: WarehouseDto;
    isModalOpen: boolean;
    selectedWarehouse: WarehouseDto | null;
    isViewMode: boolean;
    openModal: (warehouse: WarehouseDto | null, viewMode: boolean) => void;
    closeModal: () => void;
};