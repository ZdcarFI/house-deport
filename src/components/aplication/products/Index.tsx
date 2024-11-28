'use client'

import React, { useContext, useState, useEffect } from 'react';
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { ProductDto } from "@/services/Dto/ProductDto";
import ProductTable from "@/components/aplication/products/ProductTable";
import ProductModal from "@/components/aplication/products/ProductModal";
import { ProductContext } from '@/context/ProductContext/productContext';
import { BoxIcon, SearchIcon } from 'lucide-react';
import { ToastContext } from '@/context/ToastContext/ToastContext';
import { ToastType } from '@/components/Toast/Toast';
import ConfirmDialog from '@/components/modal/ConfirmDialog';
import CategoryModal from '../categories/CategoryModal';
import SizeModal from '../sizes/SizeModal';
import WarehouseModal from '../warehouses/WarehouseModal';
import StockIncrementModal from './StockIncrement';
import ProductWarehouseModal from '../productWarehouse/productWarehouseModal';

export default function Products() {
  const {
    products,
    loading,
    error,
    deleteProduct,
    openModal,
    openStockModal
  } = useContext(ProductContext)!;

  const { showToast } = useContext(ToastContext)!;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);

  
  useEffect(() => {
    if (error) {
      showToast(error, ToastType.ERROR);
    }
  }, [error, showToast]);

  const filteredProducts = React.useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.size?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAdd = () => {
    openModal(null, false);
  };

  const handleView = (product: ProductDto) => {
    openModal(product, true);
  };

  const handleEdit = (product: ProductDto) => {
    openModal(product, false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      showToast("Producto eliminado exitosamente", ToastType.SUCCESS);
      setIsConfirmDialogOpen(false);
    } catch (error) {
      showToast("Error al eliminar el producto: " + error, ToastType.ERROR);
    }
  };

  const handleIncrementStock = (product: ProductDto) => {
    openStockModal(product);
  };

  // Show loading state without blocking the UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
          <span>Productos</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Lista</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Todos los productos</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <Input
          className="w-full sm:max-w-[300px]"
          placeholder="Buscar Producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<SearchIcon className="text-default-400" size={20} />}
        />
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Agregar Producto</Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Exportar en CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={(productId: number) => {
              setSelectedProductId(productId);
              setIsConfirmDialogOpen(true);
            }}
            onView={handleView}
            onIncrementStock={handleIncrementStock}
          />
          <ProductModal showToast={showToast} />
          <CategoryModal showToast={showToast} />
          <SizeModal showToast={showToast} />
          <WarehouseModal showToast={showToast} />
          <StockIncrementModal showToast={showToast} />
          <ProductWarehouseModal showToast={showToast} />
          <ConfirmDialog
            title="¿Estás seguro de que deseas eliminar este producto?"
            isOpen={isConfirmDialogOpen}
            onConfirm={() => {
              if (selectedProductId) {
                handleDelete(selectedProductId);
              }
            }}
            onClose={() => {
              setIsConfirmDialogOpen(false);
              setSelectedProductId(null);
            }}
            onCancel={() => {
              setIsConfirmDialogOpen(false);
              setSelectedProductId(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}

