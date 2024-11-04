'use client'

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem, SelectSection } from '@nextui-org/select';
import { ProductDto } from '@/services/Dto/ProductDto';
import { CreateProductDto } from '@/services/Product/dto/CreateProductDto';
import { UpdateProductDto } from '@/services/Product/dto/UpdateProductDto';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateProductDto | UpdateProductDto) => void;
  product: ProductDto | null;
  isViewMode: boolean;
}

export default function ProductModal({ isOpen, onClose, onSubmit, product, isViewMode }: ProductModalProps) {
  const [formData, setFormData] = useState<CreateProductDto | UpdateProductDto>({
    name: '',
    code: '',
    price: 0,
    categoryId: 0,
    sizeId: 0,
    stockInventory: 0,
    stockStore: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        code: product.code,
        price: product.price,
        categoryId: product.category.id,
        sizeId: product.sizes.id,
        stockInventory: product.stockInventory,
        stockStore: product.stockStore,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        price: 0,
        categoryId: 0,
        sizeId: 0,
        stockInventory: 0,
        stockStore: 0,
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' || name === 'stockInventory' || name === 'stockStore' ? parseFloat(value) : value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: parseInt(value, 10) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'View Product' : product ? 'Edit Product' : 'Add Product'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={formData.price.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Select
              label="Category"
              name="categoryId"
              selectedKeys={[formDat.categoryId.toString()]}
              onChange={(e) => handleSelectChange('categoryId')(e.target.value)}
              isDisabled={isViewMode}
            >
              {/* Add category options here */}
            </Select>
            <Select
              label="Size"
              name="sizeId"
              selectedKeys={[formData.sizeId.toString()]}
              onChange={(e) => handleSelectChange('sizeId')(e.target.value)}
              isDisabled={isViewMode}
            >
              {/* Add size options here */}
            </Select>
            <Input
              label="Stock Inventory"
              name="stockInventory"
              type="number"
              value={formData.stockInventory.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Stock Store"
              name="stockStore"
              type="number"
              value={formData.stockStore.toString()}
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
                {product ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}