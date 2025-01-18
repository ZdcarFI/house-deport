'use client';

import React, {useContext} from 'react';
import {Button, Tooltip} from "@nextui-org/react";

import {PlusCircle, ChevronDown, ChevronUp, Eye, Edit, Trash2} from 'lucide-react';
import {ProductDto, ProductWarehouseBasicDto} from '@/services/Dto/ProductDto';
import {ProductionContext} from "@/context/ProductionContext/productionContext";
import AgregarStock from "@/components/aplication/productWarehouse/agregarStock";
import {ProductWarehouseContext} from "@/context/ProductWarehouseContext/productWarehouseContext";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {ToastType} from "@/components/Toast/Toast";
import {ToastContext} from "@/context/ToastContext/ToastContext";

interface ProductTableProps {
    products: ProductDto[];
    onView: (product: ProductDto) => void;
    onEdit: (product: ProductDto) => void;
    onDelete: (id: number) => void;
}

export default function ProductTable({products, onView, onEdit, onDelete}: ProductTableProps) {
    const {openModal} = useContext(ProductionContext)!;
    const [expandedKeys, setExpandedKeys] = React.useState<Set<number>>(new Set());
    const {productWarehouses, deleteProductWarehouse} = useContext(ProductWarehouseContext)!;
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const {showToast} = useContext(ToastContext)!;
    const [selectedProductWarehouseId, setSelectedProductWarehouseId] = React.useState<number | null>(null);

    const SearchProductwarehouse = (id: number) => {
        const warehouse = productWarehouses.find(warehouse => warehouse.id === id);
        if (!warehouse) {
            throw new Error(`No se encontró el almacén con ID: ${id}`);
        }
        return warehouse;
    };
    const handleDelete = async (id: number) => {
        try {
            const warehouse = SearchProductwarehouse(id);
            if (!warehouse) {

                showToast("El producto ya fue eliminado del almacén", ToastType.INFO);
                return;
            }


            await deleteProductWarehouse(id);
            showToast("Producto eliminado exitosamente", ToastType.SUCCESS);
            setIsConfirmDialogOpen(false);
        } catch (error) {
            showToast("Error al eliminar el producto: " + error, ToastType.ERROR);
        }
    };

    const toggleExpandRow = (id: number) => {
        setExpandedKeys((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const numberToLetter = (num: number): string => {
        return String.fromCharCode(64 + num);
    };

    const handleAddProduction = (product: ProductDto) => {
        openModal(null, false);
        const productData = {
            id: product.id,
            name: product.name,
            code: product.code,
            category: product.category,
            size: product.size,
            stockInventory: product.stockInventory,
            stockStore: product.stockStore,
        };
        window.dispatchEvent(new CustomEvent('selectProduct', {detail: productData}));
    };

    const renderActions = (product: ProductDto) => (
        <div className="flex items-center gap-4">
            <Tooltip content="Details">
                <Button isIconOnly variant="light" onPress={() => onView(product)} aria-label="View details">
                    <Eye size={20}/>
                </Button>
            </Tooltip>
            <Tooltip content="Edit product">
                <Button isIconOnly variant="light" onPress={() => onEdit(product)} aria-label="Edit product">
                    <Edit size={20}/>
                </Button>
            </Tooltip>
            <Tooltip content="Delete product">
                <Button isIconOnly color="danger" variant="light" onPress={() => onDelete(product.id)}
                        aria-label="Delete product">
                    <Trash2 size={20}/>
                </Button>
            </Tooltip>
            <Tooltip content="Add Production">
                <Button variant="light" onPress={() => handleAddProduction(product)}
                        startContent={<PlusCircle size={20}/>}>
                    Agregar producción
                </Button>
            </Tooltip>
        </div>
    );

    const renderWarehouseDetails = (warehouses: ProductWarehouseBasicDto[]) => (
        <div className="px-8 py-4 dark:bg-gray-800">
            <div className="grid grid-cols-5 gap-4 font-medium text-sm text-gray-600 dark:text-gray-300 mb-2">

                <div>NOMBRE ALMACEN</div>
                <div>FILA</div>
                <div>COLUMNA</div>
                <div>CANTIDAD</div>
                <div>ACCIONES</div>
            </div>
            {warehouses && warehouses.length > 0 ? (
                warehouses.map((warehouse) => (
                    <div key={warehouse.id}
                         className="grid grid-cols-5 gap-4 py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="dark:text-gray-200">{warehouse.name}</div>
                        <div className="dark:text-gray-200">{numberToLetter(warehouse.row)}</div>
                        <div className="dark:text-gray-200">{warehouse.column}</div>
                        <div className="dark:text-gray-200">{warehouse.quantity}</div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Tooltip content="Agregar Stock">
                                    <Button isIconOnly color="success" variant="light"
                                            className="dark:hover:bg-green-800"
                                            aria-label="Agregar Stock">
                                        <AgregarStock productWarehouse={SearchProductwarehouse(warehouse.id)}/>
                                    </Button>
                                </Tooltip>
                                {/*<Tooltip content="Eliminar Producto del almacen">*/}
                                    {/*<Button*/}
                                    {/*    isIconOnly*/}
                                    {/*    color="danger"*/}
                                    {/*    variant="light"*/}
                                    {/*    className="dark:hover:bg-red-800"*/}
                                    {/*    onPress={() => {*/}
                                    {/*        setSelectedProductWarehouseId(warehouse.id);*/}
                                    {/*        setIsConfirmDialogOpen(true);*/}
                                    {/*    }}*/}
                                    {/*    aria-label="Eliminar Producto"*/}
                                    {/*>*/}
                                    {/*    <Trash2 size={20}/>*/}
                                    {/*</Button>*/}
                                {/*</Tooltip>*/}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center italic text-gray-500 dark:text-gray-400 py-4">
                    No hay detalles de almacén disponibles
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                <tr className="text-left">
                    <th className="p-4 text-gray-700 dark:text-gray-200 font-semibold">Nombre Producto</th>
                    <th className="p-4 text-gray-700 dark:text-gray-200 font-semibold">Codigo</th>
                    <th className="p-4 text-gray-700 dark:text-gray-200 font-semibold">Stock Inventario</th>
                    <th className="p-4 text-gray-700 dark:text-gray-200 font-semibold">Stock Almacen</th>
                    <th className="p-4 text-gray-700 dark:text-gray-200 font-semibold">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <React.Fragment key={product.id}>
                        <tr className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                                        onPress={() => toggleExpandRow(product.id)}
                                        aria-label={expandedKeys.has(product.id) ? "Collapse" : "Expand"}
                                    >
                                        {expandedKeys.has(product.id) ? (
                                            <ChevronUp className="w-4 h-4"/>
                                        ) : (
                                            <ChevronDown className="w-4 h-4"/>
                                        )}
                                    </Button>
                                    <span className="ml-2 dark:text-gray-200">{product.name}</span>
                                </div>
                            </td>
                            <td className="p-4 dark:text-gray-200">{product.code}</td>
                            <td className="p-4 dark:text-gray-200">{product.stockInventory}</td>
                            <td className="p-4 dark:text-gray-200">{product.stockStore}</td>
                            <td className="p-4">{renderActions(product)}</td>
                        </tr>
                        {expandedKeys.has(product.id) && (
                            <tr className="dark:bg-gray-800">
                                <td colSpan={5} className="p-0">
                                    {renderWarehouseDetails(product.productWarehouse || [])}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <ConfirmDialog
                title="¿Estás seguro de que quitar el producto del almacen?"
                isOpen={isConfirmDialogOpen}
                onConfirm={() => {
                    if (selectedProductWarehouseId) {
                        handleDelete(selectedProductWarehouseId);
                    }
                }}
                onClose={() => {
                    setIsConfirmDialogOpen(false);
                    setSelectedProductWarehouseId(null);
                }}
                onCancel={() => {
                    setIsConfirmDialogOpen(false);
                    setSelectedProductWarehouseId(null);
                }}
            />
        </div>
    );
}