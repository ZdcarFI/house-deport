'use client'
import React, {useContext} from 'react';

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/table';
import {Tooltip} from '@nextui-org/tooltip';
import {Button} from '@nextui-org/button';
import {EditIcon} from '../../icons/table/edit-icon';
import {DeleteIcon} from '../../icons/table/delete-icon';
import {EyeIcon} from '../../icons/table/eye-icon';
import {PlusCircle, Warehouse} from 'lucide-react';
import {ProductDto} from '@/services/Dto/ProductDto';
import {ProductWarehouseContext} from '@/context/ProductWarehouseContext/productWarehouseContext';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";
import {useRouter} from "next/navigation";

interface ProductTableProps {
    products: ProductDto[];
    onView: (product: ProductDto) => void;
    onEdit: (product: ProductDto) => void;
    onDelete: (id: number) => void;
}

export default function ProductTable({products, onView, onEdit, onDelete}: ProductTableProps) {
    const router = useRouter();
    const {openModal: openModalProductWarehouse} = useContext(ProductWarehouseContext)!;

    const handleProductionClick = () => {

        return router.push('/production');
    };

    const renderCell = (product: ProductDto, columnKey: React.Key): React.ReactNode => {
        switch (columnKey) {
            case 'actions':
                return (
                    <div className="flex items-center gap-4">
                        <Tooltip content="Details" color="primary">
                            <button onClick={() => onView(product)}>
                                <EyeIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Edit product" color="secondary">
                            <button onClick={() => onEdit(product)}>
                                <EditIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Delete product" color="danger">
                            <button onClick={() => onDelete(product.id)}>
                                <DeleteIcon size={20} fill="#FF0080"/>
                            </button>
                        </Tooltip>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="min-w-5 bg-[rgb(244_244_245)] dark:bg-[rgb(39_39_42)]">
                                    <span className="text-xl font-black">⋮</span>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Actions">
                                <DropdownItem
                                    onClick={() => handleProductionClick()}
                                    key="increment-stock"
                                    color="success"
                                    textValue="Increment Stock"
                                >
                                    <>
                                        <PlusCircle size={20}/>
                                        <button>Ir a produccion</button>
                                    </>
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => openModalProductWarehouse(null, false, product)}
                                    key="send-to-warehouse"
                                    color="warning"
                                    textValue="Send to Warehouse"
                                >
                                    <>
                                        <Warehouse size={20}/>
                                        <button>Enviar al almacén</button>
                                    </>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'category':
                return product.category?.name ?? "N/A";
            case 'size':
                return product.size?.name ?? "N/A";
            case 'warehouse':
                return product.productWarehouse[0]?.name ?? "N/A";
            case 'stockInventory':
                return product.stockInventory ?? "N/A";
            case 'stockStore':
                return product.stockStore ?? "N/A";
            case 'created_at':
                return new Date(product.created_at).toLocaleDateString();
            case 'updated_at':
                return new Date(product.updated_at).toLocaleDateString();
            default:
                return product[columnKey as keyof ProductDto]?.toString() ?? "N/A";
        }
    };

    return (
        <Table aria-label="Products table">
            <TableHeader>
                <TableColumn key="name">Nombre</TableColumn>
                <TableColumn key="code">Código</TableColumn>
                <TableColumn key="price">Precio</TableColumn>
                <TableColumn key="category">Categoria</TableColumn>
                <TableColumn key="size">Talla</TableColumn>
                <TableColumn key="stockInventory">Stock en el inventario</TableColumn>
                <TableColumn key="stockStore">Stock en los almacenes</TableColumn>
                <TableColumn key="created_at">Fecha de creación</TableColumn>
                <TableColumn key="updated_at">Fecha de actualización</TableColumn>
                <TableColumn key="actions">Acciones</TableColumn>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        {(columnKey) => <TableCell>{renderCell(product, columnKey)}</TableCell>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}