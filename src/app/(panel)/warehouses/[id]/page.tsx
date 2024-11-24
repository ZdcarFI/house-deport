'use client'

import { WarehouseContext } from "@/context/WareHouseContext/warehouseContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { WarehouseDto } from "@/services/Dto/WarehouseDto";
import { Card, CardBody, CardHeader, Chip, Button, Progress, Skeleton } from "@nextui-org/react";
import WarehouseMatrix from "@/components/aplication/warehouses/WarehousesGrid";
import ProductDetails from "@/components/aplication/products/ProductsDetails";
import { ArrowLeft, Box, CheckCircle, AlertTriangle } from "lucide-react";

const WarehouseDetails = () => {
    const { id } = useParams();
    const { getWarehouse, loading, error } = useContext(WarehouseContext)!;
    const [warehouse, setWarehouse] = useState<WarehouseDto | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    
    useEffect(() => {
        if (!id) return;
        
        const fetchWarehouse = async () => {
            try {
                const warehouseData = await getWarehouse(Number(id));
                setWarehouse(warehouseData);
            } catch (e) {
                console.error("Error fetching warehouse:", e);
            }
        };
        
        fetchWarehouse();
    }, [id, getWarehouse]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-4">
                <Skeleton className="h-8 w-40 rounded-lg"/>
                <Card>
                    <CardBody className="space-y-3">
                        <Skeleton className="h-6 w-3/4 rounded-lg"/>
                        <Skeleton className="h-4 w-1/2 rounded-lg"/>
                        <Skeleton className="h-4 w-1/3 rounded-lg"/>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="container mx-auto px-4 py-8">
                <CardBody className="flex items-center justify-center text-center">
                    <AlertTriangle className="text-danger h-12 w-12 mb-4"/>
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
                    startContent={warehouse.status === 'available' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                >
                    {warehouse.status === 'available' ? 'Disponible' : 'Ocupado'}
                </Chip>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-2xl font-bold">{warehouse.name}</h1>
                        {/* <Button color="primary" variant="flat">
                            Editar Almacén
                        </Button> */}
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
                        <h2 className="text-xl font-semibold">Matriz del Almacén</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-auto">
                            <WarehouseMatrix
                                warehouse={warehouse}
                                onCellClick={setSelectedProduct}
                            />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Chip variant="flat" color="primary">Vacío</Chip>
                            <Chip variant="flat" color="success">Ocupado</Chip>
                            <Chip variant="flat" color="danger">Stock Bajo</Chip>
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
                                <ProductDetails product={selectedProduct} />
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
        </div>
    );
};

export default WarehouseDetails;