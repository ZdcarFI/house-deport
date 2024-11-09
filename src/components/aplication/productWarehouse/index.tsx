"use client";

import React from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { ProductWarehouseDto } from "@/services/Dto/ProductWarehouseDto";
import { ProductWarehouseContext } from "@/context/ProductWarehouseContext/productWarehouseContext";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { CreateProductWarehouseDto } from "@/services/ProductWarehouse/dto/CreateProductWarehouse.dto";
import { UpdateProductWarehouseDto } from "@/services/ProductWarehouse/dto/UpdateProductWarehouse.dto";
import ProductWarehouseTable from "./productWarehouseTable";
import ProductWarehouseModal from "./productWarehouseModal";
import { BoxIcon } from "lucide-react";

export default function ProductWarehouses() {
  const { productWarehouses, loading, error, createProductWarehouse, updateProductWarehouse, deleteProductWarehouse, getProductWarehouses } = React.useContext(ProductWarehouseContext)!;
  const [selectedProductWarehouse, setSelectedProductWarehouse] = React.useState<ProductWarehouseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewMode, setIsViewMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

  React.useEffect(() => {
    getProductWarehouses();
  }, []);



  const filteredProductWarehouses = React.useMemo(() => {
    return productWarehouses.filter(pw =>
      (pw.product && pw.product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pw.warehouse && pw.warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [productWarehouses, searchQuery]);
  console.log("ProductWarehouses:", productWarehouses);
  const handleAdd = () => {
    setSelectedProductWarehouse(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (productWarehouse: ProductWarehouseDto) => {
    setSelectedProductWarehouse(productWarehouse);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (productWarehouse: ProductWarehouseDto) => {
    setSelectedProductWarehouse(productWarehouse);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteProductWarehouse(id);
    setTitle("");
    setIsConfirmDialogOpen(false);
  };

  const handleSubmit = async (formData: CreateProductWarehouseDto | UpdateProductWarehouseDto) => {
    try {
      if (selectedProductWarehouse) {
        await updateProductWarehouse(selectedProductWarehouse.id, formData as UpdateProductWarehouseDto);
      } else {
        await createProductWarehouse(formData as CreateProductWarehouseDto);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting product warehouse data:", error);
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
          <BoxIcon />
          <span>Product Warehouses</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">All Product Warehouses</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            className="w-full md:w-72"
            placeholder="Search product warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Add Product Warehouse</Button>
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
                const selectedPW = productWarehouses.find(pw => pw.id === productWarehouseId);
                if (selectedPW) {
                  setSelectedProductWarehouse(selectedPW);
                  setIsConfirmDialogOpen(true);
                  setTitle("Are you sure you want to delete this product warehouse?");
                }
              }}
              onView={handleView}
            />
          )}
          <ProductWarehouseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            productWarehouse={selectedProductWarehouse}
            isViewMode={isViewMode}
          />
          <ConfirmDialog
            title={title}
            isOpen={isConfirmDialogOpen}
            onConfirm={() => {
              if (selectedProductWarehouse) {
                handleDelete(selectedProductWarehouse.id);
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