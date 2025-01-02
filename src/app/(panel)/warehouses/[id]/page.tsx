'use client'

import {useParams} from "next/navigation";
import Link from "next/link";
import React, {useContext, useState} from "react";
import {ProductBasicWithLocationDto, WarehouseDto} from "@/services/Dto/WarehouseDto";
import {Card, CardBody, CardHeader, Chip, Button, Progress, Skeleton} from "@nextui-org/react";
import WarehouseMatrix, {WarehouseProduct} from "@/components/aplication/warehouses/WarehousesGrid";
import ProductDetails from "@/components/aplication/products/ProductsDetails";
import {ArrowLeft, Box, CheckCircle, AlertTriangle} from 'lucide-react';
import {ProductWarehouseContext} from "@/context/ProductWarehouseContext/productWarehouseContext";
import {ToastContext} from "@/context/ToastContext/ToastContext";
import {ToastType} from "@/components/Toast/Toast";
import ProductWarehouseModal from "@/components/aplication/productWarehouse/productWarehouseModal";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {ProductWarehouseDto} from "@/services/Dto/ProductWarehouseDto";
import {WarehouseContext} from "@/context/WareHouseContext/warehouseContext";

const WarehouseDetails = () => {
    const {id} = useParams();
    const {
        openModal,
        deleteProductWarehouse,
        productWarehouses,
        getProductWarehouse
    } = useContext(ProductWarehouseContext)!;
    const {showToast} = useContext(ToastContext)!;
    const [warehouse, setWarehouse] = useState<WarehouseDto | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductBasicWithLocationDto | null>(null);
    const [selectedCell, setSelectedCell] = useState<{ row: number, column: number } | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [selectedProductWarehouseId, setSelectedProductWarehouseId] = useState<number | null>(null);
    const [selectedProductWarehouseSelect, setSelectedProductWarehouseSelect] = useState<ProductWarehouseDto | null | Partial<ProductWarehouseDto>>(null);
    const { getWarehouse, loading, error } = useContext(WarehouseContext)!;

    const [matrixKey, setMatrixKey] = useState(0);

    React.useEffect(() => {
        if (!id) return;

        const fetchWarehouseData = async () => {
            try {
                const warehouseData = await getWarehouse(Number(id));
                setWarehouse(warehouseData);
                await getProductWarehouse(Number(id));
            } catch (e) {
                console.error("Error fetching warehouse:", e);
            }
        };

        fetchWarehouseData();
    }, [id, getWarehouse, getProductWarehouse]);


    const handleCellClick = (product: WarehouseProduct | undefined, row: number, column: number) => {
        if (product) {
            const productWarehouse = productWarehouses.find(pw =>
                pw.product.id === product.id &&
                pw.warehouse.id === Number(id) &&
                pw.row === row &&
                pw.column === column
            );

            if (productWarehouse) {
                setSelectedProduct(product as ProductBasicWithLocationDto);
                setSelectedCell({row, column});
                setSelectedProductWarehouseId(productWarehouse.id);

                const productWarehouseSelect: Partial<ProductWarehouseDto> = {
                    id: productWarehouse.id,
                    productId: product.id,
                    warehouseId: Number(id),
                    row: row,
                    column: column,
                    quantity: productWarehouse.quantity,
                };

                setSelectedProductWarehouseSelect(productWarehouseSelect);
            } else {
                console.error("ProductWarehouse not found");
                showToast("Producto en el warehouse no encontrado", ToastType.ERROR);
            }
        } else {
            setSelectedProduct(null);
            setSelectedCell({row, column});
            setSelectedProductWarehouseId(null);
            setSelectedProductWarehouseSelect(null);
        }
    };
    const numberToLetter = (num: number) => {
        return String.fromCharCode(65 + num - 1);
    };
    const handleAddProduct = () => {
        if (warehouse && selectedCell) {
            openModal(null, false, {
                warehouseId: warehouse.id,
                row: selectedCell.row,
                column: selectedCell.column,
                onSuccess: () => {
                    // Trigger matrix refresh
                    setMatrixKey(prev => prev + 1);
                }
            });
        }
    };

    const handleEdit = (productWarehouse: ProductWarehouseDto) => {
        openModal(productWarehouse, false, {
            onSuccess: () => {
                // Trigger matrix refresh
                setMatrixKey(prev => prev + 1);
            }
        });
    };

    const handleDeleteProduct = async () => {
        if (selectedProductWarehouseId) {
            try {
                await deleteProductWarehouse(selectedProductWarehouseId);
                showToast("Producto - Warehouse eliminada exitosamente", ToastType.SUCCESS);
                setIsConfirmDialogOpen(false);
                setSelectedProduct(null);
                setSelectedProductWarehouseId(null);
                setSelectedProductWarehouseSelect(null);

                // Trigger matrix refresh
                setMatrixKey(prev => prev + 1);
            } catch (error) {
                showToast("Error: " + error, ToastType.ERROR);
            }
        }
    };


    if (!warehouse) {
        return (
            <Card className="container mx-auto px-4 py-8">
                <CardBody className="flex items-center justify-center text-center">
                    <Box className="text-warning h-12 w-12 mb-4"/>
                    <h2 className="text-xl font-bold">Almacén no encontrado</h2>
                    <p className="text-gray-500">No se encontró información del almacén solicitado.</p>
                    <Link href="/warehouses">
                        <Button color="primary" variant="shadow" className="mt-4">
                            Volver a Almacenes
                        </Button>
                    </Link>
                </CardBody>
            </Card>
        );
    }

    const usagePercentage = (warehouse.spacesUsed / warehouse.spaces) * 100;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-4">
                <Skeleton className="h-8 w-40 rounded-lg" />
                <Card>
                    <CardBody className="space-y-3">
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                        <Skeleton className="h-4 w-1/3 rounded-lg" />
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="container mx-auto px-4 py-8">
                <CardBody className="flex items-center justify-center text-center">
                    <AlertTriangle className="text-danger h-12 w-12 mb-4" />
                    <h2 className="text-xl font-bold">Error al cargar los datos</h2>
                    <p className="text-gray-500">{error}</p>
                    <Link href="/warehouses">
                        <Button color="primary" variant="shadow" className="mt-4">
                            Volver a Almacenes
                        </Button>
                    </Link>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex justify-between items-center">
                <Link href="/warehouses">
                    <Button
                        color="primary"
                        variant="light"
                        startContent={<ArrowLeft size={20}/>}
                    >
                        Volver a Almacenes
                    </Button>
                </Link>
                <Chip
                    color={warehouse.status === 'available' ? 'success' : 'warning'}
                    variant="flat"
                    startContent={warehouse.status === 'available' ? <CheckCircle size={16}/> :
                        <AlertTriangle size={16}/>}
                >
                    {warehouse.status === 'available' ? 'Disponible' : 'Ocupado'}
                </Chip>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-2xl font-bold">{warehouse.name}</h1>
                    </div>
                    <p className="text-gray-500">{warehouse.description}</p>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm">Uso de espacios</span>
                            <span className="text-sm font-semibold">
                                {warehouse.spacesUsed} de {warehouse.spaces}
                            </span>
                        </div>
                        <Progress
                            value={usagePercentage}
                            color={usagePercentage > 90 ? "danger" : usagePercentage > 70 ? "warning" : "success"}
                            className="h-2"
                        />
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Espacios del almacen</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-auto">
                            <WarehouseMatrix
                                key={matrixKey}
                                warehouse={warehouse}
                                onCellClick={handleCellClick}
                            />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Chip variant="flat" color="primary">Vacío</Chip>
                            <Chip variant="flat" color="danger">Ocupado</Chip>

                        </div>
                    </CardBody>
                </Card>

                <div className="space-y-4">
                    {selectedProduct ? (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Detalles del Producto</h2>
                            </CardHeader>
                            <CardBody>
                                <ProductDetails
                                    product={selectedProduct}
                                    onEdit={handleEdit}
                                    onDeleteProduct={() => setIsConfirmDialogOpen(true)}
                                    productWarehouseSelect={selectedProductWarehouseSelect}
                                />
                            </CardBody>
                        </Card>
                    ) : selectedCell ? (
                        <Card>
                            <CardBody className="flex flex-col items-center justify-center text-center p-8">
                                <Box className="text-gray-400 h-12 w-12 mb-4"/>
                                <p className="text-gray-500 mb-4">
                                    Celda seleccionada: Fila {numberToLetter(selectedCell.row)},
                                    Columna {selectedCell.column}
                                </p>
                                <Button color="primary" onPress={handleAddProduct}>
                                    Agregar Producto
                                </Button>
                            </CardBody>
                        </Card>
                    ) : (
                        <Card>
                            <CardBody className="flex items-center justify-center text-center p-8">
                                <Box className="text-gray-400 h-12 w-12 mb-4"/>
                                <p className="text-gray-500">
                                    Selecciona una ubicación para ver los detalles del producto
                                </p>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
            <ProductWarehouseModal
                showToast={showToast}
            />
            <ConfirmDialog
                title="¿Estás seguro de que quieres quitar el producto del almacen?"
                isOpen={isConfirmDialogOpen}
                onConfirm={handleDeleteProduct}
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
};

export default WarehouseDetails;

