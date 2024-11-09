'use client'

import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { ProductWarehouseDto } from '@/services/Dto/ProductWarehouseDto'
import { Select, SelectItem } from "@nextui-org/select";
import { CreateProductWarehouseDto } from '@/services/ProductWarehouse/dto/CreateProductWarehouse.dto'
import { UpdateProductWarehouseDto } from '@/services/ProductWarehouse/dto/UpdateProductWarehouse.dto'
import { ProductContext } from '@/context/ProductContext/productContext'
import { WarehouseContext } from '@/context/WareHouseContext/warehouseContext'

interface ProductWarehouseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: CreateProductWarehouseDto | UpdateProductWarehouseDto) => void
  productWarehouse: ProductWarehouseDto | null
  isViewMode: boolean
}

export default function ProductWarehouseModal({ isOpen, onClose, onSubmit, productWarehouse, isViewMode }: ProductWarehouseModalProps) {
  const { products } = React.useContext(ProductContext)!;
  const { warehouses } = React.useContext(WarehouseContext)!;

  const [formData, setFormData] = useState<Partial<CreateProductWarehouseDto & UpdateProductWarehouseDto> & { maxQuantity: number; maxRow: number; maxColumn: number }>({
    productId: 0,
    warehouseId: 0,
    quantity: 0,
    row: 0,
    column: 0,
    maxQuantity: 0,
    maxRow: 0,
    maxColumn: 0,
  });

  useEffect(() => {
    if (productWarehouse) {
      setFormData({
        productId: productWarehouse.product.id,
        warehouseId: productWarehouse.warehouse.id,
        quantity: productWarehouse.quantity,
        row: productWarehouse.row,
        column: productWarehouse.column,
        maxQuantity: productWarehouse.product.stockInventory, 
        maxRow: productWarehouse.warehouse.rowMax, 
        maxColumn: productWarehouse.warehouse.columnMax, 
      });
    }
  }, [productWarehouse]);

  const handleSelectChange = (name: string) => (value: string) => {
    const id = parseInt(value);

    if (name === 'productId') {
      const selectedProduct = products.find(p => p.id === id);
      setFormData(prevFormData => ({
        ...prevFormData,
        productId: id,
        maxQuantity: selectedProduct ? selectedProduct.stockInventory : 0
      }));
    } else if (name === 'warehouseId') {
      const selectedWarehouse = warehouses.find(w => w.id === id);
      setFormData(prevFormData => ({
        ...prevFormData,
        warehouseId: id,
        maxRow: selectedWarehouse ? selectedWarehouse.rowMax : 0,
        maxColumn: selectedWarehouse ? selectedWarehouse.columnMax : 0
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const { quantity, row, column, maxQuantity, maxRow, maxColumn } = formData;
    if (
      quantity! <= 0 || quantity! > maxQuantity! ||
      row! <= 0 || row! > maxRow! ||
      column! <= 0 || column! > maxColumn!
    ) {
      alert("Please ensure all fields are within allowed limits.");
      return;
    }

    onSubmit(formData as CreateProductWarehouseDto | UpdateProductWarehouseDto);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'View Product Warehouse' : productWarehouse ? 'Edit Product Warehouse' : 'Add Product Warehouse'}
          </ModalHeader>
          <ModalBody>
            <Select
              label="Product"
              name="productId"
              placeholder="Select a product"
              onChange={(e) => handleSelectChange('productId')(e.target.value)}
              value={formData.productId?.toString()}
              isDisabled={isViewMode}
            >
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </Select>
            {formData.maxQuantity > 0 && <p>Max quantity: {formData.maxQuantity}</p>}

            <Select
              label="Warehouse"
              name="warehouseId"
              placeholder="Select a warehouse"
              onChange={(e) => handleSelectChange('warehouseId')(e.target.value)}
              value={formData.warehouseId?.toString()}
              isDisabled={isViewMode}
            >
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>
        
            {formData.maxRow > 0 && <p>Max rows: {formData.maxRow}, Max columns: {formData.maxColumn}</p>}

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity?.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Row"
              name="row"
              type="number"
              value={formData.row?.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Column"
              name="column"
              type="number"
              value={formData.column?.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {productWarehouse ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
