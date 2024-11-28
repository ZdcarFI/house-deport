'use client'

import React, { useState, useEffect, useContext } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from "@nextui-org/select";
import { CreateProductWarehouseDto } from '@/services/ProductWarehouse/dto/CreateProductWarehouse.dto'
import { UpdateProductWarehouseDto } from '@/services/ProductWarehouse/dto/UpdateProductWarehouse.dto'
import { ProductContext } from '@/context/ProductContext/productContext'
import { WarehouseContext } from '@/context/WareHouseContext/warehouseContext'
import { ToastType } from '@/components/Toast/Toast'
import { ProductWarehouseContext } from '@/context/ProductWarehouseContext/productWarehouseContext'
import { ProductDto } from '@/services/Dto/ProductDto'
import { WarehouseDto } from '@/services/Dto/WarehouseDto'
import { Card, CardBody } from '@nextui-org/card'
import WarehouseSelector from '../warehouses/WarehouseSelector'

interface Props {
  showToast: (message: string, type: ToastType) => void;
}

interface ProductSearchState {
  searchByCode: boolean;
  code: string;
  name: string;
  selectedCategoryId: number | null;
  selectedSizeId: number | null;
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
  const [isProductDisabled, setIsProductDisabled] = useState(false);
  const [isWarehouseDisabled, setIsWarehouseDisabled] = useState(false);

  useEffect(() => {
    let productDisabled = false;
    let warehouseDisabled = false;
    if (selectedProductWarehouse) {
      setFormData({
        productId: selectedProductWarehouse.product?.id || selectedProductWarehouse.productId,
        warehouseId: selectedProductWarehouse.warehouse?.id || selectedProductWarehouse.warehouseId,
        quantity: selectedProductWarehouse.quantity,
        row: selectedProductWarehouse.row,
        column: selectedProductWarehouse.column,
      });
      productDisabled = true;
      warehouseDisabled = true;
    } else if (initialData) {
      if ('code' in initialData) {
        // It's a ProductDto
        setFormData(prevState => ({
          ...prevState,
          productId: (initialData as ProductDto).id,
        }));
        productDisabled = true;
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
        warehouseDisabled = true;
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

    // Set product disabled state
    setIsProductDisabled(productDisabled);
    setIsWarehouseDisabled(warehouseDisabled)
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

  const handleLocationSelect = (warehouseId: number, row: number, column: number) => {
    const selectedWarehouse = warehouses.find(w => w.id === warehouseId);

    // Check if location is already occupied
    const isLocationOccupied = productWarehouses.find(pw =>
      pw.warehouse.id === warehouseId &&
      pw.row === row &&
      pw.column === column &&
      (!selectedProductWarehouse || pw.id !== selectedProductWarehouse.id)
    );

    if (isLocationOccupied) {
      showToast(`Esta ubicación ya está ocupada por el producto: ${isLocationOccupied.product.name}`, ToastType.ERROR);
      return;
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      warehouseId,
      row,
      column,
      maxRow: selectedWarehouse ? selectedWarehouse.rowMax : 0,
      maxColumn: selectedWarehouse ? selectedWarehouse.columnMax : 0
    }));
  };
  const numberToLetter = (num: number) => {
    return String.fromCharCode(65 + num - 1);
  };
  const getSelectedProduct = () => {
    return products.find(p => p.id === formData.productId);
  };

  const [searchState, setSearchState] = useState<ProductSearchState>({
    searchByCode: true,
    code: '',
    name: '',
    selectedCategoryId: null,
    selectedSizeId: null
  });

  const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([]);

  // Function to handle code search
  const handleCodeSearch = (code: string) => {
    if (code.length > 10) {
      showToast("El código no puede tener más de 10 caracteres", ToastType.WARNING);
      return;
    }

    setSearchState(prev => ({ ...prev, code }));

    const product = products.find(p =>
      p.code.toLowerCase() === code.toLowerCase()
    );

    if (product) {
      setFormData(prev => ({
        ...prev,
        productId: product.id,
        maxQuantity: product.stockInventory
      }));
      setFilteredProducts([product]);
    } else if (code.length === 10) {
      setFilteredProducts([]);
      showToast("No se encontraron coincidencias con ningún producto", ToastType.ERROR);
    }
  };

  // Function to handle name search
  const handleNameSearch = (name: string) => {
    setSearchState(prev => ({ ...prev, name, selectedCategoryId: null, selectedSizeId: null }));

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Function to handle category selection
  const handleCategorySelect = (categoryId: number) => {
    setSearchState(prev => ({
      ...prev,
      selectedCategoryId: categoryId,
      selectedSizeId: null // Reset size when category changes
    }));

    const filtered = filteredProducts.filter(p =>
      p.category?.id === categoryId
    );
    setFilteredProducts(filtered);
  };

  // Function to handle size selection
  const handleSizeSelect = (sizeId: number) => {
    setSearchState(prev => ({ ...prev, selectedSizeId: sizeId }));

    const filtered = filteredProducts.filter(p =>
      p.size?.id === sizeId
    );
    setFilteredProducts(filtered);

    if (filtered.length === 1) {
      setFormData(prev => ({
        ...prev,
        productId: filtered[0].id,
        maxQuantity: filtered[0].stockInventory
      }));
    }
  };

  // Get available categories based on filtered products
  const getAvailableCategories = () => {
    const categories = new Set(
      filteredProducts.map(p => p.category).filter(Boolean)
    );
    return Array.from(categories);
  };

  // Get available sizes based on selected category
  const getAvailableSizes = () => {
    if (!searchState.selectedCategoryId) return [];
    const sizes = new Set(
      filteredProducts
        .filter(p => p.category?.id === searchState.selectedCategoryId)
        .map(p => p.size)
        .filter(Boolean)
    );
    return Array.from(sizes);
  };

  const renderProductSearch = () => (
    <Card className="p-4">
      <CardBody className="space-y-4">

        {!isViewMode && !isProductDisabled && (
          <>
            <div className="flex gap-4 mb-4">
              <Button
                color={searchState.searchByCode ? "primary" : "default"}
                onClick={() => setSearchState(prev => ({ ...prev, searchByCode: true }))}
              >
                Buscar por código
              </Button>
              <Button
                color={!searchState.searchByCode ? "primary" : "default"}
                onClick={() => setSearchState(prev => ({ ...prev, searchByCode: false }))}
              >
                Buscar por filtros
              </Button>
            </div>

            {searchState.searchByCode ? (
              <Input
                label="Código del producto"
                value={searchState.code}
                onChange={(e) => handleCodeSearch(e.target.value)}
                maxLength={10}
                placeholder="Ingrese el código del producto"
              />
            ) : (
              <div className="space-y-4">
                <Input
                  label="Nombre del producto"
                  value={searchState.name}
                  onChange={(e) => handleNameSearch(e.target.value)}
                  placeholder="Buscar por nombre"
                />

                {searchState.name && (
                  <Select
                    label="Categoría"
                    placeholder="Seleccione una categoría"
                    selectedKeys={searchState.selectedCategoryId ? [searchState.selectedCategoryId.toString()] : []}
                    onChange={(e) => handleCategorySelect(parseInt(e.target.value))}
                  >
                    {getAvailableCategories().map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                {searchState.selectedCategoryId && (
                  <Select
                    label="Talla"
                    placeholder="Seleccione una talla"
                    selectedKeys={searchState.selectedSizeId ? [searchState.selectedSizeId.toString()] : []}
                    onChange={(e) => handleSizeSelect(parseInt(e.target.value))}
                  >
                    {getAvailableSizes().map((size) => (
                      <SelectItem key={size.id} value={size.id.toString()}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>
            )}
          </>
        )}



        {getSelectedProduct() && (
          <div className="mt-4 space-y-4">
            <span className='font-bold text-blue-600'>Datos del producto:</span>
            <Input
              label="Nombre"
              value={getSelectedProduct()?.name || ''}
              isDisabled
            />
            <Input
              label="Código"
              value={getSelectedProduct()?.code || ''}
              isDisabled
            />
            <div className="grid grid-cols-2 gap-x-4">

              <Input
                label="Categoría"
                value={getSelectedProduct()?.category?.name || ''}
                isDisabled
              />
              <Input
                label="Talla"
                value={getSelectedProduct()?.size?.name || ''}
                isDisabled
              />
            </div>

            <Input
              label="Precio"
              value={getSelectedProduct()?.price?.toString() || ''}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">S/.</span>
                </div>
              }
              isDisabled
            />
          </div>
        )}

        {formData.productId > 0 && (
          <Input
            label="Cantidad a enviar"
            name="quantity"
            type="number"
            value={formData.quantity?.toString()}
            onChange={handleInputChange}
            required
            errorMessage={errors.quantity}
            isInvalid={!!errors.quantity}
          />
        )}
      </CardBody>
    </Card>
  );

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
      size='full'
      isOpen={isModalOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      classNames={{
        base: "h-screen rounded-l-lg rounded-r-none w-2/3 m-0",
        header: "border-b border-divider",
        footer: "border-t border-divider",
        body: "py-6"
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit} className="h-screen flex flex-col">
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'Ver producto en el almacen' : selectedProductWarehouse ? 'Editar Producto y almacen' : 'Agregar producto en el almacen'}
          </ModalHeader>
          <ModalBody className='flex-grow overflow-hidden'>
            <div className="h-full grid grid-cols-2 gap-6">
              <div className="overflow-y-auto pr-4 space-y-6">
                {renderProductSearch()}
              </div>
              <div className="overflow-y-auto pr-4">
                <Card className="p-4">
                  <CardBody className="space-y-4">
                    <WarehouseSelector
                      onLocationSelect={handleLocationSelect}
                      isWarehouseDisabled={isWarehouseDisabled}
                    />

                    {formData.row > 0 && formData.column > 0 && (
                      <div className="mt-4 p-4 bg-default-100 rounded-lg">
                        <h4 className="font-semibold mb-2">Ubicación donde se enviara:</h4>
                        <p>Fila: {numberToLetter(formData.row)}, Columna: {formData.column}</p>
                      </div>
                    )}

                    {errors.location && (
                      <div className="text-red-500 text-sm mt-2">
                        {errors.location}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Cerrar
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {selectedProductWarehouse ? 'Actualizar' : 'Crear'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}