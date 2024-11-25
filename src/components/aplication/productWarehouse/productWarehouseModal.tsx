'use client'

import React, { useState, useEffect, useContext } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { ProductWarehouseDto } from '@/services/Dto/ProductWarehouseDto'
import { Select, SelectItem } from "@nextui-org/select";
import { CreateProductWarehouseDto } from '@/services/ProductWarehouse/dto/CreateProductWarehouse.dto'
import { UpdateProductWarehouseDto } from '@/services/ProductWarehouse/dto/UpdateProductWarehouse.dto'
import { ProductContext } from '@/context/ProductContext/productContext'
import { WarehouseContext } from '@/context/WareHouseContext/warehouseContext'
import { ToastType } from '@/components/Toast/Toast'
import { ProductWarehouseContext } from '@/context/ProductWarehouseContext/productWarehouseContext'
import { ProductDto } from '@/services/Dto/ProductDto'
import { WarehouseDto } from '@/services/Dto/WarehouseDto'

interface Props {
  showToast: (message: string, type: ToastType) => void;
}

interface FormErrors {
  quantity?: string;
  row?: string;
  column?: string;
  location?: string;
}

export default function ProductWarehouseModal({ showToast }: Props) {
  const {
    isModalOpen,
    closeModal,
    selectedProductWarehouse,
    isViewMode,
    createProductWarehouse,
    updateProductWarehouse,
    productWarehouses,
    initialData,
  } = useContext(ProductWarehouseContext)!;

  const { products } = React.useContext(ProductContext)!;
  const { warehouses } = React.useContext(WarehouseContext)!;

  const [formData, setFormData] = useState<
    (CreateProductWarehouseDto | UpdateProductWarehouseDto) & {
      maxQuantity?: number;
      maxRow?: number;
      maxColumn?: number;
    }
  >({
    productId: 0,
    warehouseId: 0,
    quantity: 0,
    row: 0,
    column: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  useEffect(() => {
    if (selectedProductWarehouse) {
      setFormData({
        productId: selectedProductWarehouse.product?.id || selectedProductWarehouse.productId,
        warehouseId: selectedProductWarehouse.warehouse?.id || selectedProductWarehouse.warehouseId,
        quantity: selectedProductWarehouse.quantity,
        row: selectedProductWarehouse.row,
        column: selectedProductWarehouse.column,
      });
    } else if (initialData) {
      if ('code' in initialData) {
        // It's a ProductDto
        setFormData(prevState => ({
          ...prevState,
          productId: (initialData as ProductDto).id,
        }));
      } else if ('rowMax' in initialData) {
        // It's a WarehouseDto
        setFormData(prevState => ({
          ...prevState,
          warehouseId: (initialData as WarehouseDto).id,
        }));
      } else if ('warehouseId' in initialData && 'row' in initialData && 'column' in initialData) {
        // New condition to handle warehouseId, row, and column data
        setFormData(prevState => ({
          ...prevState,
          warehouseId: (initialData as { warehouseId: number, row: number, column: number }).warehouseId,
          row: (initialData as { warehouseId: number, row: number, column: number }).row,
          column: (initialData as { warehouseId: number, row: number, column: number }).column,
        }));
      }
    } else {
      setFormData({
        productId: 0,
        warehouseId: 0,
        quantity: 0,
        row: 0,
        column: 0,
      });
    }
    setErrors({});
  }, [selectedProductWarehouse, initialData]);

  const checkLocationAvailability = (warehouseId: number, row: number, column: number): boolean => {
    const existingProduct = productWarehouses.find(pw =>
      pw.warehouse.id === warehouseId &&
      pw.row === row &&
      pw.column === column &&
      (!selectedProductWarehouse || pw.id !== selectedProductWarehouse.id) // 
    );

    if (existingProduct) {
      setErrors(prev => ({
        ...prev,
        location: `Ya esta ocupado esta celda (fila: ${row}, Columna: ${column}) por el producto: ${existingProduct.product.name}`
      }));
      return false;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.location;
      return newErrors;
    });
    return true;
  };

  const validateField = (name: string, value: number) => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
      case 'quantity':
        if (value < 0) {
          newErrors.quantity = 'Cantidad mayor o igual a 0';
        } else if (formData.maxQuantity && value > formData.maxQuantity) {
          newErrors.quantity = `La cantidad no puede exceder de ${formData.maxQuantity}`;
        } else {
          delete newErrors.quantity;
        }
        break;
      case 'row':
        if (value < 0) {
          newErrors.row = 'La fila debe ser mayor a 0';
        } else if (formData.maxRow && value > formData.maxRow) {
          newErrors.row = `La fila no puede exceder de  ${formData.maxRow} que es la fila maxima del almacen`;
        } else {
          delete newErrors.row;
          // Verificar disponibilidad de ubicación cuando cambia la fila
          if (formData.warehouseId && formData.column !== undefined) {
            checkLocationAvailability(formData.warehouseId, value, formData.column);
          }
        }
        break;
      case 'column':
        if (value < 0) {
          newErrors.column = 'La columna debe ser mayor a 0';
        } else if (formData.maxColumn && value > formData.maxColumn) {
          newErrors.column = `La columna no puede exceder de ${formData.maxColumn}que es la columna maxima del almacen`;
        } else {
          delete newErrors.column;
          if (formData.warehouseId && formData.row !== undefined) {
            checkLocationAvailability(formData.warehouseId, formData.row, value);
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

      if (formData.row !== undefined && formData.column !== undefined) {
        checkLocationAvailability(id, formData.row, formData.column);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);

    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));

    validateField(name, numValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submitting
    const isQuantityValid = validateField('quantity', formData.quantity);
    const isRowValid = validateField('row', formData.row);
    const isColumnValid = validateField('column', formData.column);

    // Verificar disponibilidad de ubicación
    const isLocationAvailable = checkLocationAvailability(
      formData.warehouseId,
      formData.row,
      formData.column
    );

    if (!isQuantityValid || !isRowValid || !isColumnValid || !isLocationAvailable) {
      showToast("Please fix the validation errors", ToastType.ERROR);
      return;
    }

    try {
      if (selectedProductWarehouse) {
        await updateProductWarehouse(selectedProductWarehouse.id, formData as UpdateProductWarehouseDto);
        showToast("Product warehouse updated successfully", ToastType.SUCCESS);
      } else {
        await createProductWarehouse(formData as CreateProductWarehouseDto);
        showToast("Product warehouse created successfully", ToastType.SUCCESS);
      }
      closeModal();
    } catch (error) {
      showToast("Error submitting product warehouse data: " + error, ToastType.ERROR);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      classNames={{
        base: "max-w-xl",
        header: "border-b border-gray-200 dark:border-gray-700",
        footer: "border-t border-gray-200 dark:border-gray-700",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'Ver producto en el almacen' : selectedProductWarehouse ? 'Editar Producto y almacen' : 'Agregar producto en el almacen'}
          </ModalHeader>
          <ModalBody>
            <Select
              label="Producto"
              name="productId"
              placeholder="Selecciona un producto"
              selectedKeys={formData.productId ? [formData.productId.toString()] : []}
              onChange={(e) => handleSelectChange('productId')(e.target.value)}
              isDisabled={isViewMode}
            >
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </Select>



            <Input
              label="Cantidad"
              name="quantity"
              type="number"
              value={formData.quantity?.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
              errorMessage={errors.quantity}
              isInvalid={!!errors.quantity}
            />
            <Select
              label="Almacen"
              name="warehouseId"
              placeholder="Selecciona un almacen"
              selectedKeys={formData.warehouseId ? [formData.warehouseId.toString()] : []}
              onChange={(e) => handleSelectChange('warehouseId')(e.target.value)}
              isDisabled={isViewMode}
            >
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Fila"
              name="row"
              type="number"
              value={formData.row?.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
              errorMessage={errors.row}
              isInvalid={!!errors.row}
            />

            <Input
              label="Columna"
              name="column"
              type="number"
              value={formData.column?.toString()}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
              errorMessage={errors.column}
              isInvalid={!!errors.column}
            />

            {errors.location && (
              <div className="text-red-500 text-sm mt-2">
                {errors.location}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {selectedProductWarehouse ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}