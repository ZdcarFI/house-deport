'use client'

import React, { useContext, useState, useEffect } from 'react';
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { ProductDto } from "@/services/Dto/ProductDto";
import { CreateProductDto } from "@/services/Product/dto/CreateProductDto";
import { UpdateProductDto } from "@/services/Product/dto/UpdateProductDto";
import ProductTable from "@/components/aplication/products/ProductTable";
import ProductModal from "@/components/aplication/products/ProductModal";
import { ProductContext } from '@/context/ProductContext/productContext';
import { BoxIcon } from 'lucide-react';
import { ProductContextType } from "@/@types/product";

export default function Products() {
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProducts,
  } = useContext(ProductContext) as ProductContextType;

  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = React.useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sizes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productWarehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (product: ProductDto) => {
    setSelectedProduct(product);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ProductDto) => {
    setSelectedProduct(product);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const handleSubmit = async (formData: CreateProductDto | UpdateProductDto) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData as UpdateProductDto);
      } else {
        await createProduct(formData as CreateProductDto);
      }
      setIsModalOpen(false);
      getProducts();
    } catch (error) {
      console.error("Error submitting product data:", error);
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
          <span>Products</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">All Products</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            className="w-full md:w-72"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Add Product</Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
          <ProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            product={selectedProduct}
            isViewMode={isViewMode}
          />
        </div>
      </div>
    </div>
  );
}