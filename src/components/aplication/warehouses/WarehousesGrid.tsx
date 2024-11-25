import React from 'react';
import { WarehouseDto } from "@/services/Dto/WarehouseDto";
import { Button } from "@nextui-org/react";

interface WarehouseMatrixProps {
    warehouse: WarehouseDto;
    onCellClick: (product: any | null, row: number, column: number) => void;
}

const WarehouseMatrix: React.FC<WarehouseMatrixProps> = ({ warehouse, onCellClick }) => {
    const getCellColor = (row: number, col: number) => {
        const product = warehouse.products.find(p => p.row === row && p.column === col);
        if (!product) return 'bg-blue-500'; 
        if (product.quantity <= 20) return 'bg-red-500'; 
        return 'bg-green-500'; 
    };

    return (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${warehouse.columnMax}, minmax(0, 1fr))` }}>
            {Array.from({ length: warehouse.rowMax * warehouse.columnMax }).map((_, index) => {
                const row = Math.floor(index / warehouse.columnMax) + 1;
                const col = (index % warehouse.columnMax) + 1;
                const product = warehouse.products.find(p => p.row === row && p.column === col);
                return (
                    <Button
                        key={index}
                        className={`w-12 h-12 rounded-full ${getCellColor(row, col)}`}
                        onPress={() => onCellClick(product || null, row, col)}
                        isIconOnly
                    />
                );
            })}
        </div>
    );
};

export default WarehouseMatrix;

