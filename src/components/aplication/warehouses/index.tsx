"use client";

import React, { useContext, useMemo } from "react";
import { Button, Input, Card, CardBody, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { WarehouseDto } from "@/services/Dto/WarehouseDto";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { WarehouseContext } from "@/context/WareHouseContext/warehouseContext";
import { SearchIcon, WarehouseIcon, AlertTriangle } from "lucide-react";
import WarehouseTable from "./WarehouseTable";
import WarehouseModal from "./WarehouseModal";
import { ToastContext } from "@/context/ToastContext/ToastContext";
import { ToastType } from "@/components/Toast/Toast";

export default function Warehouses() {
    const {
        warehouses,
        loading,
        error,
        deleteWarehouse,
        openModal
    } = useContext(WarehouseContext)!;

    const { showToast } = useContext(ToastContext)!;

    const [searchQuery, setSearchQuery] = React.useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<number | null>(null);

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter(warehouse =>
            warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [warehouses, searchQuery]);

    const handleAdd = () => openModal(null, false);

    const onView = (warehouse: WarehouseDto) => openModal(warehouse, true);

    const handleEdit = (warehouse: WarehouseDto) => openModal(warehouse, false);

    const handleDelete = async (id: number) => {
        try {
            await deleteWarehouse(id);
            showToast("Almacén eliminado exitosamente", ToastType.SUCCESS);
            setIsConfirmDialogOpen(false);
        }
        catch (error) {
            showToast("Error: " + error, ToastType.ERROR);
        }
    };

    if (loading) {
        return (
            <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <div className="flex justify-between">
                        <Skeleton className="h-10 w-72 rounded-lg" />
                        <Skeleton className="h-10 w-48 rounded-lg" />
                    </div>
                    <Card>
                        <CardBody className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-lg" />
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto">
                <CardBody className="flex flex-col items-center justify-center py-8">
                    <AlertTriangle className="text-danger h-12 w-12 mb-4" />
                    <h2 className="text-xl font-bold text-danger">Error al cargar los almacenes</h2>
                    <p className="text-gray-500 mt-2">{error}</p>
                    <Button
                        color="primary"
                        variant="shadow"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <Card className="shadow-sm">
                <CardBody className="space-y-6">
                    {/* Breadcrumb */}
                    <ul className="flex">
                        <li className="flex gap-2">
                            <HouseIcon />
                            <Link href={"/"}>
                                <span>Inicio</span>
                            </Link>
                            <span> / </span>
                        </li>
                        <li className="flex gap-2">
                            <span>Almacene</span>
                            <span> / </span>
                        </li>
                        <li className="flex gap-2">
                            <span>Lista</span>
                        </li>
                    </ul>

                    {/* Title */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Todos los almacenes</h3>
                       
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <Input
                            className="sm:max-w-[300px]"
                            placeholder="Buscar almacén..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startContent={<SearchIcon className="text-default-400" size={20} />}
                            size="sm"
                        />
                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                onPress={handleAdd}
                                startContent={<WarehouseIcon size={20} />}
                            >
                                Agregar Almacén
                            </Button>
                            <Button
                                color="secondary"
                                variant="flat"
                                startContent={<ExportIcon />}
                            >
                                Exportar CSV
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-lg border border-default-200">
                        <WarehouseTable
                            warehouses={filteredWarehouses}
                            onEdit={handleEdit}
                            onDelete={(warehouseId: number) => {
                                setSelectedWarehouseId(warehouseId);
                                setIsConfirmDialogOpen(true);
                            }}
                            onView={onView}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Modals */}
            <WarehouseModal showToast={showToast} />

            <ConfirmDialog
                title="¿Estás seguro de que deseas eliminar este almacén?"
                isOpen={isConfirmDialogOpen}
                onConfirm={() => selectedWarehouseId && handleDelete(selectedWarehouseId)}
                onClose={() => {
                    setIsConfirmDialogOpen(false);
                    setSelectedWarehouseId(null);
                }}
                onCancel={() => {
                    setIsConfirmDialogOpen(false);
                    setSelectedWarehouseId(null);
                }}
            />
        </div>
    );
}