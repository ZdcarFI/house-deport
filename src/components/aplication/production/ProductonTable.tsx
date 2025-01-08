import React, {useContext} from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/table';
import {Tooltip} from '@nextui-org/tooltip';
import {EditIcon} from '../../icons/table/edit-icon';
import {EyeIcon} from '../../icons/table/eye-icon';
import {ProductionDto} from '@/services/Dto/ProductionDto';
import {Chip} from "@nextui-org/chip";
import {ProductContext} from "@/context/ProductContext/productContext";

interface ProductionTableProps {
    productions: ProductionDto[];
    onView: (production: ProductionDto) => void;
    onEdit: (production: ProductionDto) => void;

}

export default function ProductionTable({productions, onView, onEdit}: ProductionTableProps) {

    const {products} = useContext(ProductContext)!;
    const findProductByCode = (code: string) => {
        return products.find((product) => product.code === code);
    }
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'warning'
            case 'completed':
                return 'success'
            case 'canceled':
                return 'danger'
            default:
                return 'default'
        }
    }
    const renderCell = (production: ProductionDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'actions':
                return (
                    <div className="flex items-center gap-4">
                        <Tooltip content="Details" color="primary">
                            <button onClick={() => onView(production)}>
                                <EyeIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        {production.status !== 'completed' && production.status !== 'canceled' && (
                            <Tooltip content="Edit production" color="secondary">
                                <button onClick={() => onEdit(production)}>
                                    <EditIcon size={20} fill="#979797"/>
                                </button>
                            </Tooltip>
                        )}
                    </div>
                );
            case 'product': {
                const product = findProductByCode(production.product.code);
                if (!product) {
                    return (
                        <span className="text-gray-500 italic dark:text-gray-400">
                Producto no encontrado
            </span>
                    );
                }

                return (
                    <div className="flex flex-col gap-2">

                        <span className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                {product.name}
            </span>

                        {product.size?.name && (
                            <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Tamaño:
                    </span>
                                <Chip
                                    variant="flat"
                                    color="primary"
                                    className="text-xs font-medium px-3 py-1 dark:bg-blue-800 dark:text-blue-200"
                                >
                                    {product.size.name}
                                </Chip>
                            </div>
                        )}


                        {product.category?.name && (
                            <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Categoría:
                    </span>
                                <Chip
                                    variant="flat"
                                    color="secondary"
                                    className="text-xs font-medium px-3 py-1 dark:bg-purple-800 dark:text-purple-200"
                                >
                                    {product.category.name}
                                </Chip>
                            </div>
                        )}
                    </div>
                );
            }


            case 'quantity':
                return production.quantity
            case 'state':
                return (
                    <Chip
                        color={getStatusColor(production.status)}
                        variant="flat"
                        size="sm"
                        className="capitalize"
                    >

                        {production.status === 'completed' ? 'Completado' : production.status === 'canceled' ? 'Cancelado' : 'Pendiente'}

                    </Chip>
                )
            case 'user_order':
                return production.user_order.firstName
            case 'user_receive_order':
                return production.user_receive_order?.firstName || ''
            default:
                return null
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
                <TableColumn>Cantidad</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Usuario que ordeno</TableColumn>
                <TableColumn>Usuario que recibio</TableColumn>
                <TableColumn>Fecha de creación</TableColumn>
                <TableColumn>Fecha de actualización</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
                {productions.map((production) => (
                    <TableRow key={production.id}>
                        <TableCell>{renderCell(production, 'product')}</TableCell>
                        <TableCell>{renderCell(production, 'quantity')}</TableCell>
                        <TableCell>{renderCell(production, 'state')}</TableCell>
                        <TableCell>{renderCell(production, 'user_order')}</TableCell>
                        <TableCell>{renderCell(production, 'user_receive_order')}</TableCell>
                        <TableCell>{new Date(production.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(production.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell>{renderCell(production, 'actions')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}