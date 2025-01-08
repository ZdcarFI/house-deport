import React, { Key, useContext } from 'react';
import { ProductBasicWithLocationDto, WarehouseDto } from "@/services/Dto/WarehouseDto";
import { Button, Tooltip, Chip, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { ProductContext } from '@/context/ProductContext/productContext';
import { ProductDto } from '@/services/Dto/ProductDto';

export type WarehouseProduct = Omit<ProductDto, "productWarehouse" | "stockInventory" | "stockStore"> | ProductBasicWithLocationDto;

interface WarehouseMatrixProps {
    warehouse: WarehouseDto;
    onCellClick: (product: WarehouseProduct | undefined, row: number, column: number) => void;
}

interface ColumnData {
    key: string;
    label: string;
    width?: number;
}

interface RowData {
    key: string;
    [key: string]: React.ReactNode;
}

const WarehouseMatrix: React.FC<WarehouseMatrixProps> = ({ warehouse, onCellClick }) => {
    const { products } = useContext(ProductContext)!;

    const getCellColor = (row: number, col: number): 'primary' | 'danger' => {
        const product = warehouse.products.find(p => p.row === row && p.column === col);
        return product ? 'primary' : 'danger';
    };

    const getRowLabel = (index: number) => String.fromCharCode(65 + index);

    const renderCellTooltipContent = (row: number, col: number) => {
        const product = warehouse.products.find(p => p.row === row && p.column === col);

        if (!product) return <p className='font-bold text-blue-500'>Se encuentra vacío</p>;

        const fullProductDetails = products.find(p => p.id === product.id);

        return (
            <div className="flex flex-col gap-2 p-2">
                <p className='text-red-500 font-bold'>Ocupado</p>
                <p>Producto: <span className="font-bold">{product.name}</span></p>
                <p>Codigo: <span className="font-bold">{product.code}</span></p>
                <div className="flex items-center gap-2">
                    <span>Cantidad:</span>
                    <Chip
                        color={product.quantity <= 5 ? 'danger' : 'success'}
                        size="sm"
                        variant="flat"
                    >
                        {product.quantity}
                    </Chip>
                </div>
                {fullProductDetails?.category && (
                    <div className="flex items-center gap-2">
                        <span>Categoría:</span>
                        <Chip size="sm" variant="flat">
                            {fullProductDetails.category.name}
                        </Chip>
                    </div>
                )}
                {fullProductDetails?.size && (
                    <div className="flex items-center gap-2">
                        <span>Talla:</span>
                        <Chip size="sm" variant="flat">
                            {fullProductDetails.size.name}
                        </Chip>
                    </div>
                )}
            </div>
        );
    };

    const columns: ColumnData[] = [
        { key: 'rowLabel', label: 'Row', width: 60 },
        ...Array.from({ length: warehouse.columnMax }, (_, index) => ({
            key: `column-${index + 1}`,
            label: `${index + 1}`,
            width: 60,
        }))
    ];

    const rows: RowData[] = Array.from({ length: warehouse.rowMax }, (_, rowIndex) => {
        const row = rowIndex + 1;
        const rowData: RowData = {
            key: `row-${row}`,
            rowLabel: getRowLabel(rowIndex),
        };

        Array.from({ length: warehouse.columnMax }, (_, colIndex) => {
            const col = colIndex + 1;
            const product = warehouse.products.find(p => p.row === row && p.column === col);
            const cellColor = getCellColor(row, col);
            const cellLocation = `${getRowLabel(rowIndex)}${col}`;

            rowData[`column-${col}`] = (
                <Tooltip
                    content={renderCellTooltipContent(row, col)}
                    placement="top"
                   
                >
                    <Button
                        isIconOnly
                        variant="flat"
                        aria-label={`Cell ${cellLocation}`}
                        className={`w-12 h-12 min-w-0 mx-auto ${
                            cellColor === 'primary' ? 'bg-red-500 hover:bg-red-300' : 'bg-blue-500 hover:bg-blue-300'
                        }`}
                        onPress={() => onCellClick(product, row, col)}
                    >
                        <span className="text-tiny font-medium">{cellLocation}</span>
                    </Button>
                </Tooltip>
            );
        });

        return rowData;
    });

    return (
        <div className="w-full overflow-x-auto">
            <Table
                aria-label="Warehouse Matrix"
                classNames={{
                    base: "max-w-full",
                    table: "min-w-full",
                    th: "bg-default-100 text-default-800 text-center font-bold",
                    td: "text-center",
                }}
                removeWrapper
            >
                <TableHeader columns={columns}>
                    {(column: ColumnData) => (
                        <TableColumn
                            key={column.key}
                            className={`${column.width ? `w-[${column.width}px]` : ''}`}
                        >
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={rows}>
                    {(item: RowData) => (
                        <TableRow key={item.key}>
                            {(columnKey: Key) => {
                                const colKeyString = String(columnKey);
                                return (
                                    <TableCell key={`${item.key}-${colKeyString}`} >
                                        {colKeyString === 'rowLabel' ? (
                                            <div className="flex items-center justify-center h-12 font-bold">
                                                {item.rowLabel}
                                            </div>
                                        ) : (
                                            item[colKeyString] || null
                                        )}
                                    </TableCell>
                                );
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default WarehouseMatrix;