import React, { useState, useContext, useEffect } from 'react';
import { Select, SelectItem, Button } from "@nextui-org/react";
import { WarehouseContext } from "@/context/WareHouseContext/warehouseContext";
import WarehouseMatrix from "@/components/aplication/warehouses/WarehousesGrid";
import { WarehouseDto } from "@/services/Dto/WarehouseDto";

interface WarehouseSelectorProps {
    onLocationSelect: (warehouseId: number, row: number, column: number) => void;
    isWarehouseDisabled: boolean;
}

const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({ onLocationSelect, isWarehouseDisabled }) => {
    const { warehouses, openModal: ModalWarehouse } = useContext(WarehouseContext)!;
    const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseDto | null>(null);

    const handleAdd = () => {
        ModalWarehouse(null, false);
    }

    const handleWarehouseChange = (warehouseId: string) => {
        const warehouse = warehouses.find(w => w.id === parseInt(warehouseId));
        setSelectedWarehouse(warehouse || null);
        // Reset location by calling onLocationSelect with 0s
        onLocationSelect(parseInt(warehouseId), 0, 0);
    };

    const handleCellClick = (product: any | null, row: number, column: number) => {
        if (selectedWarehouse && !product) {
            onLocationSelect(selectedWarehouse.id, row, column);
        }
    };

    // Reset location when component mounts
    useEffect(() => {
        if (selectedWarehouse) {
            onLocationSelect(selectedWarehouse.id, 0, 0);
        }
    }, []);

    return (
        <div className="space-y-4">
            <div className='flex gap-4'>
                <Select
                    label="Seleccionar Almacén"
                    placeholder="Elige un almacén"
                    onChange={(e) => handleWarehouseChange(e.target.value)}
                    isDisabled={isWarehouseDisabled}
                >
                    {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.name}
                        </SelectItem>
                    ))}
                </Select>
                {!isWarehouseDisabled ? (<Button
                    color="primary"
                    onPress={handleAdd}
                    className="self-end"
                >
                    Agregar Almacén
                </Button>) : ''}

            </div>

            {selectedWarehouse && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Matriz del Almacén</h4>
                    <WarehouseMatrix
                        warehouse={selectedWarehouse}
                        onCellClick={handleCellClick}
                    />
                    <p className="mt-2 text-sm text-gray-600">
                        Haz clic en una celda vacía para seleccionar la ubicación del producto.
                    </p>
                </div>
            )}
        </div>
    );
};

export default WarehouseSelector;

