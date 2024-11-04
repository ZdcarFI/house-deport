'use client'

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { OrderDto } from '@/services/Dto/OrderDto';
import { CreateOrderDto, ProductBasicCreateDto } from '@/services/Order/dto/CreateOrderDto';
import { UpdateOrderDto } from '@/services/Order/dto/UpdateOrderDto';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateOrderDto | UpdateOrderDto) => void;
  order: OrderDto | null;
  isViewMode: boolean;
}

export default function OrderModal({ isOpen, onClose, onSubmit, order, isViewMode }: OrderModalProps) {
  const [formData, setFormData] = useState<CreateOrderDto>({
    numFac: '',
    clientId: 0,
    userId: 0,
    products: [],
  });

  useEffect(() => {
    if (order) {
      setFormData({
        numFac: order.numFac,
        clientId: order.clientId,
        userId: order.userId,
        products: order.products.map(p => ({ id: p.id, quantity: p.quantity })),
      });
    } else {
      setFormData({
        numFac: '',
        clientId: 0,
        userId: 0,
        products: [],
      });
    }
  }, [order]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'clientId' || name === 'userId' ? parseInt(value, 10) : value });
  };

  const handleProductChange = (index: number, field: keyof ProductBasicCreateDto, value: string) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: field === 'quantity' ? parseInt(value, 10) : parseInt(value, 10) };
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProduct = () => {
    setFormData({ ...formData, products: [...formData.products, { id: 0, quantity: 0 }] });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
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
            {isViewMode ? 'View Order' : order ? 'Edit Order' : 'Add Order'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Invoice Number"
              name="numFac"
              value={formData.numFac}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Client ID"
              name="clientId"
              type="number"
              value={formData.clientId.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="User ID"
              name="userId"
              type="number"
              value={formData.userId.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <div>
              <h4>Products</h4>
              {formData.products.map((product, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    label="Product ID"
                    value={product.id.toString()}
                    onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                    required
                    isReadOnly={isViewMode}
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    value={product.quantity.toString()}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    required
                    isReadOnly={isViewMode}
                  />
                  {!isViewMode && (
                    <Button color="danger" onPress={() => removeProduct(index)}>Remove</Button>
                  )}
                </div>
              ))}
              {!isViewMode && (
                <Button color="primary" onPress={addProduct}>Add Product</Button>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {order ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}