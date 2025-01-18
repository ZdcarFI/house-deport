import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/table';
import {Tooltip} from '@nextui-org/tooltip';
import {ProductWarehouseDto} from '@/services/Dto/ProductWarehouseDto';
import React from 'react';
import AgregarStock from "@/components/aplication/productWarehouse/agregarStock";

interface ProductWarehouseTableProps {
    productWarehouses: ProductWarehouseDto[];
    onDelete: (id: number) => void;
}

export default function ProductWarehouseTable({
                                                  productWarehouses,
                                                  onDelete,
                                              }: ProductWarehouseTableProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(price);
    };

    const formatDate = (date: string | Date) => {
        const dateObject = typeof date === 'string' ? new Date(date) : date;
        return dateObject.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const numberToLetter = (num: number): string => {

        return String.fromCharCode(64 + num);
    };

    const renderCell = (productWarehouse: ProductWarehouseDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'product':
                return (
                    <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {productWarehouse.product.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                {productWarehouse.product.code}
                            </span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                {formatPrice(productWarehouse.product.price)}
                            </span>
                        </div>
                    </div>
                );

            case 'warehouse':
                return (
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        {productWarehouse.warehouse.name}
                    </span>
                );

            case 'quantity':
                return (
                    <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                        productWarehouse.quantity > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                        {productWarehouse.quantity.toString()}
                    </span>
                );

            case 'location':
                return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Fila: {numberToLetter((productWarehouse.row))}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Columna: {productWarehouse.column}
                        </span>
                    </div>
                );

            case 'created_at':
            case 'updated_at':
                const date = productWarehouse[columnKey];
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(date)}
                    </span>
                );

            case 'actions':
                return (
                    <div className="flex items-center gap-2">
                        <Tooltip content="Agregar Stock" color="success">
                            <button
                                className="p-1 hover:bg-green-100 rounded-full transition-colors dark:hover:bg-green-900/30">
                                <AgregarStock productWarehouse={productWarehouse}/>
                            </button>
                        </Tooltip>

                        <Tooltip content="Eliminar Producto del almacen" color="danger">
                            <button
                                onClick={() => onDelete(productWarehouse.id)}
                                className="p-1 hover:bg-red-100 rounded-full transition-colors dark:hover:bg-red-900/30"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-red-500 dark:text-red-400"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6h18"/>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                );

            default:
                return '';
        }
    };

    return (
        <Table
            aria-label="Product Warehouses table"
            classNames={{
                base: "max-w-full",
                table: "min-w-full",
                thead: "bg-gray-50 dark:bg-gray-800",
                th: "text-gray-500 dark:text-gray-400 font-medium text-sm",
                tr: "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                td: "py-3"
            }}
        >
            <TableHeader>
                <TableColumn>Producto</TableColumn>
                <TableColumn>Almacen</TableColumn>
                <TableColumn>Cantidad</TableColumn>
                <TableColumn>Ubicacion</TableColumn>
                <TableColumn>Fecha de creación</TableColumn>
                <TableColumn>Fecha de actualización</TableColumn>
                <TableColumn align="center">Acciones</TableColumn>
            </TableHeader>
            <TableBody>
                {productWarehouses.map((productWarehouse) => (
                    <TableRow key={productWarehouse.id}>
                        <TableCell>{renderCell(productWarehouse, 'product')}</TableCell>
                        <TableCell>{renderCell(productWarehouse, 'warehouse')}</TableCell>
                        <TableCell>{renderCell(productWarehouse, 'quantity')}</TableCell>
                        <TableCell>{renderCell(productWarehouse, 'location')}</TableCell>
                        <TableCell>{renderCell(productWarehouse, 'created_at')}</TableCell>
                        <TableCell>{renderCell(productWarehouse, 'updated_at')}</TableCell>
                        <TableCell>{renderCell(productWarehouse, 'actions')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}