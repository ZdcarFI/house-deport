"use client"

import React, { useCallback, useState } from 'react';
import { WarehouseContextType } from "@/@types/warehouse";
import { WarehouseDto } from "@/services/Dto/WarehouseDto";
import { WarehouseService } from "@/services/Warehouse/WarehouseService";
import { CreateWarehouseDto } from "@/services/Warehouse/dto/CreateWarehouseDto";
import { AxiosError } from "axios";
import { UpdateWarehouseDto } from "@/services/Warehouse/dto/UpdateWarehouseDto";
import { WarehouseActionType, WarehouseState, warehouseReducer } from './warehouseReducer';

export const WarehouseContext = React.createContext<WarehouseContextType | null>(null);

const warehouseService = new WarehouseService();

const warehouseInitialState: WarehouseDto = {
    id: 0,
    name: '',
    rowMax: 0,
    columnMax: 0,
    status: '',
    description: '',
    color: '',
    spaces: 0,
    spacesUsed: 0,
    products: [],
}

const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(warehouseReducer, { warehouses: [] } as WarehouseState);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseDto | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    React.useEffect(() => {
        const fetchWarehouses = async () => {
            setLoading(true);
            try {
                await getWarehouses();
            } catch (e) {
                console.error("Error loading warehouses:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouses();
    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const getWarehouses = async (): Promise<void> => {
        try {
            const warehouses = await warehouseService.getAll();
            dispatch({ type: WarehouseActionType.LOAD_WAREHOUSES, payload: warehouses });
       
        } catch (e) {
            handleError(e);
        }
    };



    const createWarehouse = async (warehouse: CreateWarehouseDto): Promise<void> => {
        try {
            const res = await warehouseService.create(warehouse);
            dispatch({ type: WarehouseActionType.ADD_WAREHOUSE, payload: res });
            setSelectedWarehouse(warehouseInitialState);
        } catch (e) {
            handleError(e);
        }
    };

    const updateWarehouse = async (id: number, warehouse: UpdateWarehouseDto): Promise<void> => {
        try {
            const res = await warehouseService.updateById(id, warehouse);
            dispatch({ type: WarehouseActionType.EDIT_WAREHOUSE, payload: res });
            setSelectedWarehouse(warehouseInitialState);
        } catch (e) {
            handleError(e);
        }
    };

    const getWarehouse = async (id: number): Promise<WarehouseDto> => {
        try {
            return await warehouseService.getById(id);
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const deleteWarehouse = async (id: number): Promise<void> => {
        try {
            await warehouseService.deleteById(id);
            dispatch({ type: WarehouseActionType.REMOVE_WAREHOUSE, payload: id });
        } catch (e) {
            handleError(e);
        }
    };


    const openModal = useCallback((warehouse: WarehouseDto | null = null, viewMode: boolean = false) => {
        setSelectedWarehouse(warehouse);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);


    const values = React.useMemo(() => ({
        warehouses: state.warehouses,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,
        getWarehouses,
        loading,
        getWarehouse,
        error,
        warehouse: warehouseInitialState,
        isModalOpen,
        selectedWarehouse,
        isViewMode,
        openModal,
        closeModal,
    }), [state.warehouses, loading, error, isModalOpen, selectedWarehouse, isViewMode, openModal, closeModal]);

    return (
        <WarehouseContext.Provider value={values}>
            {children}
        </WarehouseContext.Provider>
    );
};

export default WarehouseProvider;