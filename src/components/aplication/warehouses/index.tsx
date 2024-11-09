"use client";

import React from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";

import { WarehouseDto } from "@/services/Dto/WarehouseDto";

import { CreateWarehouseDto } from "@/services/Warehouse/dto/CreateWarehouseDto";
import { UpdateWarehouseDto } from "@/services/Warehouse/dto/UpdateWarehouseDto";

import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { WarehouseContext } from "@/context/WareHouseContext/warehouseContext";
import { WarehouseIcon } from "lucide-react";
import WarehouseTable from "./WarehouseTable";
import WarehouseModal from "./WarehouseModal";

export default function Warehouses() {
    const {
        warehouses,
        loading,
        error,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse
    } = React.useContext(WarehouseContext)!;

    const [selectedWarehouse, setSelectedWarehouse] = React.useState<WarehouseDto | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isViewMode, setIsViewMode] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

    const filteredWarehouses = React.useMemo(() => {
        return warehouses.filter(warehouse =>
            warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [warehouses, searchQuery]);

    const handleAdd = () => {
        setSelectedWarehouse(null);
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const handleView = (warehouse: WarehouseDto) => {
        setSelectedWarehouse(warehouse);
        setIsViewMode(true);
        setIsModalOpen(true);
    };

    const handleEdit = (warehouse: WarehouseDto) => {
        setSelectedWarehouse(warehouse);
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteWarehouse(id);
        setTitle("");
        setIsConfirmDialogOpen(false);
    };

    const handleSubmit = async (formData: CreateWarehouseDto | UpdateWarehouseDto) => {
        try {
            if (selectedWarehouse) {
                await updateWarehouse(selectedWarehouse.id, formData as UpdateWarehouseDto);
            } else {
                await createWarehouse(formData as CreateWarehouseDto);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting warehouse data:", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon />
                    <Link href={"/"}>
                        <span>Home</span>
                    </Link>
                    <span> / </span>{" "}
                </li>

                <li className="flex gap-2">
                    <WarehouseIcon />
                    <span>Warehouses</span>
                    <span> / </span>{" "}
                </li>
                <li className="flex gap-2">
                    <span>List</span>
                </li>
            </ul>
            <h3 className="text-xl font-semibold">All Warehouses</h3>

            <div className="flex justify-between flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <Input
                        className="w-full md:w-72"
                        placeholder="Search warehouses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Button color="primary" onPress={handleAdd}>Agregar Almacén</Button>
                    <Button color="primary" startContent={<ExportIcon />}>
                        Exportar en CSV
                    </Button>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <WarehouseTable
                        warehouses={filteredWarehouses}
                        onEdit={handleEdit}
                        onDelete={(warehouseId: number) => {
                            const selectedWarehouse = warehouses.find(warehouse => warehouse.id === warehouseId);
                            setSelectedWarehouse(selectedWarehouse);
                            setIsConfirmDialogOpen(true);
                            setTitle("Are you sure you want to delete this warehouse?");
                        }}
                        onView={handleView}
                    />
                    <WarehouseModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        warehouse={selectedWarehouse}
                        isViewMode={isViewMode}
                    />
                    <ConfirmDialog
                        title={title}
                        isOpen={isConfirmDialogOpen}
                        onConfirm={() => {
                            if (selectedWarehouse) {
                                handleDelete(selectedWarehouse.id);
                            }
                        }}
                        onClose={() => {
                            setIsConfirmDialogOpen(false);
                            setTitle("");
                        }}
                        onCancel={() => {
                            setIsConfirmDialogOpen(false);
                            setTitle("");
                        }}
                    />
                </div>
            </div>
        </div>
    )
}