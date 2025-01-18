"use client";

import React, { useContext, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { ProductWarehouseDto } from "@/services/Dto/ProductWarehouseDto";
import { ProductWarehouseContext } from "@/context/ProductWarehouseContext/productWarehouseContext";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import ProductWarehouseTable from "./productWarehouseTable";
import ProductWarehouseModal from "./productWarehouseModal";
import { BoxIcon, SearchIcon } from "lucide-react";
import { ToastContext } from "@/context/ToastContext/ToastContext";
import { ToastType } from "@/components/Toast/Toast";

export default function ProductWarehouses() {
  const { productWarehouses, loading, error, deleteProductWarehouse, openModal } = React.useContext(ProductWarehouseContext)!;
  const { showToast } = useContext(ToastContext)!;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

  const [selectedProductWarehouseId, setSelectedProductWarehouseId] = React.useState<number | null>(null);

  useEffect(() => {
    if (error) {
      showToast(error, ToastType.ERROR);
    }
  }, [error, showToast]);

  const filteredProductWarehouses = React.useMemo(() => {
    return productWarehouses.filter(pw =>
      (pw.product && pw.product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pw.warehouse && pw.warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [productWarehouses, searchQuery]);

  const handleAdd = () => {
    openModal(null, false);
  };

  const handleView = (productWarehouse: ProductWarehouseDto) => {
    openModal(productWarehouse, true);
  };

  const handleEdit = (productWarehouse: ProductWarehouseDto) => {
    openModal(productWarehouse, false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProductWarehouse(id);
      showToast("Producto - Warehouse eliminada exitosamente", ToastType.SUCCESS);
      setIsConfirmDialogOpen(false);
    }
    catch (error) {
      showToast("Error:" + error, ToastType.ERROR);
    }
  };

  // Show loading state without blocking the UI
  if (loading) {
    return (
<<<<<<< Updated upstream
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
=======
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon/>
                    <Link href={"/"}>
                        <span>Home</span>
                    </Link>
                    <span> / </span>{" "}
                </li>
                <li className="flex gap-2">
                    <BoxIcon/>
                    <span>Producto en el Almacen</span>
                    <span> / </span>{" "}
                </li>
                <li className="flex gap-2">
                    <span>Lista</span>
                </li>
            </ul>
            <h3 className="text-xl font-semibold">Todos los productos y su almacen</h3>
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <Input
                    className="w-full sm:max-w-[300px]"
                    placeholder="Buscar producto en el almacen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<SearchIcon className="text-default-400" size={20}/>}
                />
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Button color="primary" onPress={handleAdd}>Enviar Producto al almacen</Button>

                </div>
                <div className="w-full flex flex-col gap-4">
                    {productWarehouses.length === 0 ? (
                        <div>No product warehouses found.</div>
                    ) : (
                        <ProductWarehouseTable
                            productWarehouses={filteredProductWarehouses}
>>>>>>> Stashed changes


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
          <BoxIcon />
          <span>Producto en el Almacen</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Lista</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Todos los productos y su almacen</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <Input
          className="w-full sm:max-w-[300px]"
          placeholder="Buscar producto en el almacen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<SearchIcon className="text-default-400" size={20} />}
        />
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Enviar Producto al almacen</Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          {productWarehouses.length === 0 ? (
            <div>No product warehouses found.</div>
          ) : (
            <ProductWarehouseTable
              productWarehouses={filteredProductWarehouses}
              onEdit={handleEdit}
              onDelete={(productWarehouseId: number) => {
                setSelectedProductWarehouseId(productWarehouseId);
                setIsConfirmDialogOpen(true);
              }}
              onView={handleView}
            />
          )}
          <ProductWarehouseModal
            showToast={showToast} />

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
      </div>
    </div>
  )
}