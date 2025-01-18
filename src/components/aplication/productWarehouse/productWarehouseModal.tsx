'use client'

import React, {useState, useEffect, useContext} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/modal'
import {Button} from '@nextui-org/button'

import {CreateProductWarehouseDto} from '@/services/ProductWarehouse/dto/CreateProductWarehouse.dto'
import {UpdateProductWarehouseDto} from '@/services/ProductWarehouse/dto/UpdateProductWarehouse.dto'
import {ProductContext} from '@/context/ProductContext/productContext'
import {WarehouseContext} from '@/context/WareHouseContext/warehouseContext'
import {ToastType} from '@/components/Toast/Toast'
import {ProductWarehouseContext} from '@/context/ProductWarehouseContext/productWarehouseContext'
import {ProductDto} from '@/services/Dto/ProductDto'
import {WarehouseDto} from '@/services/Dto/WarehouseDto'
import {Card, CardBody} from '@nextui-org/card'
import WarehouseSelector from '../warehouses/WarehouseSelector'
import ProductSearch from "@/components/aplication/products/ProductSearch";

interface Props {
    showToast: (message: string, type: ToastType) => void;
}


interface FormErrors {
    quantity?: string;
    row?: string;
    column?: string;
    location?: string;
}

export default function ProductWarehouseModal({showToast}: Props) {
    const {
        isModalOpen,
        closeModal,
        selectedProductWarehouse,
        isViewMode,
        createProductWarehouse,
<<<<<<< Updated upstream
        updateProductWarehouse,
=======

>>>>>>> Stashed changes
        productWarehouses,
        initialData,
    } = useContext(ProductWarehouseContext)!;

    const {getProducts, products} = React.useContext(ProductContext)!;
    const {warehouses} = React.useContext(WarehouseContext)!;
    const boolean = true;
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
    const initialFormState = {
        productId: 0,
        warehouseId: 0,
        quantity: 0,
        row: 0,
        column: 0,
    };


    const [errors, setErrors] = useState<FormErrors>({});
    const [isProductDisabled, setIsProductDisabled] = useState(false);
    const [isWarehouseDisabled, setIsWarehouseDisabled] = useState(false);
    const [productSelected, setProductSelected] = useState<ProductDto | undefined>(undefined);
    const resetForm = () => {
        setFormData(initialFormState);
        setErrors({});
        setProductSelected(undefined);
    };
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
            const newErrors = {...prev};
            delete newErrors.location;
            return newErrors;
        });
        return true;
    };

    const validateField = (name: string, value: number) => {
        const newErrors: FormErrors = {...errors};

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

    const renderProductSearch = () => (
        <ProductSearch
            boolean={boolean}
            products={products}
            isViewMode={isViewMode}
            isProductDisabled={isProductDisabled}
            showToast={showToast}
            onProductSelect={(productId) => {
                setProductSelected(products.find(p => p.id === productId));
                setFormData(prev => ({
                    ...prev,
                    productId
                }));
            }}
            selectedProduct={productSelected}
            onQuantityChange={(value) => {
                setFormData(prev => ({
                    ...prev,
                    quantity: value
                }));
                validateField('quantity', value);
            }}
            quantity={formData.quantity}
            quantityError={errors.quantity}
        />
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


<<<<<<< Updated upstream
        console.log('formData', formData);
        console.log('selectedProductWarehouse', selectedProductWarehouse?.id);
        /*try {
            if (selectedProductWarehouse) {
                await updateProductWarehouse(selectedProductWarehouse.id, formData as UpdateProductWarehouseDto);
                showToast("Product warehouse updated successfully", ToastType.SUCCESS);
            } else {
                await createProductWarehouse(formData as CreateProductWarehouseDto);
                showToast("Product warehouse created successfully", ToastType.SUCCESS);
            }
=======
        try {


            await createProductWarehouse(formData as CreateProductWarehouseDto);
            showToast("Product warehouse created successfully", ToastType.SUCCESS);
>>>>>>> Stashed changes
            await getProducts();

            // Reset the form after successful creation
            resetForm();

            closeModal();
        } catch (error) {
            showToast("Error submitting product warehouse data: " + error, ToastType.ERROR);
        }*/

    };

    return (
        <Modal
            size='full'
            isOpen={isModalOpen}
<<<<<<< Updated upstream
            onClose={closeModal}
=======
            onClose={() => {
                closeModal();
                resetForm(); // Reset form when modal is closed
            }}
>>>>>>> Stashed changes
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
