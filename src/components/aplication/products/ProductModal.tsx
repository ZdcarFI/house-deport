'use client'

import React, { useState, useEffect, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Card, CardBody } from "@nextui-org/card";
import { CreateProductDto, LocationDto } from '@/services/Product/dto/CreateProductDto';
import { UpdateProductDto } from '@/services/Product/dto/UpdateProductDto';
import { CategoryContext } from "@/context/CategoryContext/categoryContext";
import { ToastType } from '@/components/Toast/Toast';
import { ProductContext } from '@/context/ProductContext/productContext';
import { WarehouseContext } from '@/context/WareHouseContext/warehouseContext';
import { Archive, Edit, Eye, Package, Plus, Trash2 } from 'lucide-react';
import { Badge, Divider } from '@nextui-org/react';
import WarehouseSelector from '../warehouses/WarehouseSelector';

interface Props {
    showToast: (message: string, type: ToastType) => void;
}

interface FormErrors {
    name?: string;
    code?: string;
    category?: string;
    size?: string;
    location?: string;
}

export default function ProductModal({ showToast }: Props) {
    const { isModalOpen, closeModal, selectedProduct, isViewMode, createProduct, updateProduct, products } = useContext(ProductContext)!;
    let isWarehouseDisabled = false;
    const [formData, setFormData] = useState<CreateProductDto & {
        stockStore: number,
        stockInventory: number,
    }>({
        name: '',
        code: '',
        price: 0,
        categoryId: 0,
        sizeId: 0,
        stockInventory: 0,
        location: [],
        stockStore: 0,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const {
        categories,
        openModal: ModalCategory
    } = useContext(CategoryContext)!;

    const {
        warehouses,
    } = useContext(WarehouseContext)!;

    const [currentLocation, setCurrentLocation] = useState<Partial<LocationDto>>({
        row: 0,
        column: 0,
        quantity: 0,
        warehouseId: 0
    });

    const numberToLetter = (num: number) => {
        return String.fromCharCode(65 + num - 1);
    };

    const handleLocationSelect = (warehouseId: number, row: number, column: number) => {
        // Reset to initial state first
        setCurrentLocation({
            warehouseId: 0,
            row: 0,
            column: 0,
            quantity: 0
        });

        // Then set new values
        setCurrentLocation({
            warehouseId,
            row,
            column,
            quantity: 0
        });
    };

    useEffect(() => {
        if (selectedProduct) {
            const mappedData: CreateProductDto & { stockStore: number } = {
                name: selectedProduct.name,
                code: selectedProduct.code,
                price: selectedProduct.price,
                categoryId: selectedProduct.category?.id || 0,
                sizeId: selectedProduct.size?.id || 0,
                stockInventory: selectedProduct.stockInventory,
                stockStore: selectedProduct.stockStore || 0,
                location: selectedProduct.productWarehouse || [],
            };
            setFormData(mappedData);
        } else {
            setFormData({
                name: '',
                code: '',
                price: 0,
                categoryId: 0,
                sizeId: 0,
                stockInventory: 0,
                stockStore: 0,
                location: [],
            });
        }
        setErrors({});
    }, [selectedProduct]);

    const checkDuplicateProduct = () => {
        const duplicate = products.find(p =>
            p.name.toLowerCase() === formData.name.toLowerCase() &&
            p.code.toLowerCase() === formData.code.toLowerCase() &&
            p.category.id === formData.categoryId &&
            p.size.id === formData.sizeId &&
            (!selectedProduct || p.id !== selectedProduct.id)
        );

        if (duplicate) {
            setErrors(prev => ({
                ...prev,
                name: 'Ya existe un producto con el mismo nombre, código, categoría y talla',
                code: 'Ya existe un producto con el mismo nombre, código, categoría y talla',
                category: 'Ya existe un producto con el mismo nombre, código, categoría y talla',
                size: 'Ya existe un producto con el mismo nombre, código, categoría y talla'
            }));
            return false;
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.name;
            delete newErrors.code;
            delete newErrors.category;
            delete newErrors.size;
            return newErrors;
        });
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: name === 'price' || name === 'stockInventory' || name === 'stockStore' ? parseFloat(value) : value
        };
        setFormData(newFormData);

        // Check for duplicates when relevant fields change
        if (['name', 'code'].includes(name)) {
            setTimeout(() => checkDuplicateProduct(), 0);
        }
    };

    const handleSelectChange = (name: string) => (value: string) => {
        const newFormData = { ...formData, [name]: parseInt(value, 10) };
        setFormData(newFormData);

        // Check for duplicates when category or size changes
        if (['categoryId', 'sizeId'].includes(name)) {
            const updatedFormData = { ...formData, [name]: parseInt(value, 10) };
            const duplicate = products.find(p =>
                p.name.toLowerCase() === updatedFormData.name.toLowerCase() &&
                p.code.toLowerCase() === updatedFormData.code.toLowerCase() &&
                (name === 'categoryId' ? parseInt(value, 10) : updatedFormData.categoryId) === p.category.id &&
                (name === 'sizeId' ? parseInt(value, 10) : updatedFormData.sizeId) === p.size.id &&
                (!selectedProduct || p.id !== selectedProduct.id)
            );

            if (duplicate) {
                showToast("Ya existe un producto con estas características", ToastType.ERROR);
                setErrors(prev => ({
                    ...prev,
                    name: 'Ya existe un producto con el mismo nombre, código, categoría y talla',
                    code: 'Ya existe un producto con el mismo nombre, código, categoría y talla',
                    category: 'Ya existe un producto con el mismo nombre, código, categoría y talla',
                    size: 'Ya existe un producto con el mismo nombre, código, categoría y talla'
                }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.name;
                    delete newErrors.code;
                    delete newErrors.category;
                    delete newErrors.size;
                    return newErrors;
                });
            }
        }
    };

    const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentLocation({
            ...currentLocation,
            [name]: parseInt(value, 10)
        });
    };


    const addLocation = () => {
        if (currentLocation.warehouseId && currentLocation.row !== undefined &&
            currentLocation.column !== undefined && currentLocation.quantity !== undefined) {

            // Validate quantity is greater than 0
            if (currentLocation.quantity <= 0) {
                showToast("La cantidad debe ser mayor a 0", ToastType.ERROR);
                return;
            }

            // Check if location is already occupied in current session
            const isLocationOccupied = formData.location.some(loc =>
                loc.warehouseId === currentLocation.warehouseId &&
                loc.row === currentLocation.row &&
                loc.column === currentLocation.column
            );

            if (isLocationOccupied) {
                showToast("Esta ubicación ya sera ocupada por el producto, escoga otra ubicación", ToastType.ERROR);
                return;
            }

            const newLocation: LocationDto = {
                warehouseId: currentLocation.warehouseId,
                row: currentLocation.row,
                column: currentLocation.column,
                quantity: currentLocation.quantity
            };

            setFormData({
                ...formData,
                location: [...formData.location, newLocation]
            });

            // Reset location fields after adding
            setCurrentLocation({
                row: 0,
                column: 0,
                quantity: 0,
                warehouseId: currentLocation.warehouseId
            });
        }
    };
    const removeLocation = (index: number) => {
        const newLocations = formData.location.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            location: newLocations
        });
    };

    const getSizeOptions = (): React.JSX.Element[] => {
        if (!formData.categoryId) return [];
        const category = categories.find((category) => category.id === formData.categoryId);
        if (!category?.sizes?.length) return [];

        return category.sizes.map((size) => (
            <SelectItem key={size.id} value={size.id.toString()}>
                {size.name}
            </SelectItem>
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        try {
            const dataToSend = {
                ...formData,
                price: formData.price ? parseFloat(formData.price.toString()) : 0
            };

            if (selectedProduct) {
                const updateData: UpdateProductDto = {
                    ...dataToSend,
                    name: dataToSend.name,
                    code: dataToSend.code,
                    categoryId: dataToSend.categoryId,
                    sizeId: dataToSend.sizeId,
                    stockInventory: dataToSend.stockInventory,
                    stockStore: dataToSend.stockStore,
                    location: dataToSend.location,
                };
                await updateProduct(selectedProduct.id, updateData);
                showToast("Producto actualizado exitosamente", ToastType.SUCCESS);
            } else {
                const createData: CreateProductDto = {
                    ...formData,
                };
                await createProduct(createData);
                showToast("Producto creado exitosamente", ToastType.SUCCESS);
            }
            closeModal();
        } catch (error) {
            showToast("Error al enviar los datos del Producto:" + error, ToastType.ERROR);
        }
    };

    const handleEditCategory = () => {
        if (formData.categoryId) {
            const selectedCategory = categories.find(
                category => category.id === formData.categoryId
            );
            if (selectedCategory) {
                ModalCategory(selectedCategory, false);
            }
        } else {
            ModalCategory(null, false);
        }
    };

    const renderBasicInfo = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Información básica
            </h3>
            <div className="space-y-4">
                <Input
                    label="Nombre del producto"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    variant="bordered"
                    isRequired
                    isDisabled={isViewMode}
                    errorMessage={errors.name}
                    isInvalid={!!errors.name}
                />
                <Input
                    label="Código del producto"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    variant="bordered"
                    isRequired
                    isDisabled={isViewMode}
                    errorMessage={errors.code}
                    isInvalid={!!errors.code}
                />
                <Input
                    label="Precio del producto"
                    name="price"
                    type="number"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">S/. </span>
                        </div>
                    }
                    value={formData.price ? formData.price.toString() : ''}
                    onChange={handleInputChange}
                    variant="bordered"
                    isRequired
                    isDisabled={isViewMode}
                />
            </div>
        </div>
    );

    const renderCategorization = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorización</h3>
            <div className="space-y-4">
                <Select
                    label="Categoría del producto"
                    name="categoryId"
                    placeholder="Seleccione una categoría"
                    onChange={(e) => handleSelectChange('categoryId')(e.target.value)}
                    selectedKeys={formData.categoryId ? [formData.categoryId.toString()] : []}
                    isDisabled={isViewMode}
                    variant="bordered"
                    errorMessage={errors.category}
                    isInvalid={!!errors.category}
                >
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    label="Tamaño"
                    name="sizeId"
                    placeholder="Seleccione un tamaño"
                    selectedKeys={formData.sizeId ? [formData.sizeId.toString()] : []}
                    onChange={(e) => handleSelectChange('sizeId')(e.target.value)}
                    isDisabled={!formData.categoryId || isViewMode}
                    errorMessage={errors.size}
                    isInvalid={!!errors.size}
                >
                    {getSizeOptions()}
                </Select>

                {!isViewMode && (
                    <Button
                        color="primary"
                        variant="flat"
                        onPress={handleEditCategory}
                        startContent={<Edit className="w-4 h-4" />}
                        className="w-full"
                    >
                        {formData.categoryId ? "Editar categoría" : "Nueva categoría"}
                    </Button>
                )}
            </div>
        </div>
    );

    const renderInventoryInfo = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Inventario</h3>
            <div className="space-y-4">
                <Input
                    label="Stock en inventario"
                    name="stockInventory"
                    type="number"
                    value={formData.stockInventory ? formData.stockInventory.toString() : ''}
                    onChange={handleInputChange}
                    variant="bordered"
                    isRequired
                />
                <Input
                    label="Stock en tienda"
                    name="stockStore"
                    type="number"
                    value={formData.stockStore ? formData.stockStore.toString() : ''}
                    onChange={handleInputChange}
                    variant="bordered"
                    isRequired
                />
            </div>
        </div>
    );

    const renderLocations = () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Ubicaciones en Almacén
                    <span className='font-extralight text-xs'>{'  '}Esto lo puede hacer o mas adelante</span>
                </h3>
            </div>
            <WarehouseSelector
                onLocationSelect={handleLocationSelect}
                isWarehouseDisabled={isWarehouseDisabled} />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Fila"
                    name="row"
                    type="text"
                    value={currentLocation.row ? numberToLetter(currentLocation.row) : ''}
                    onChange={handleLocationInputChange}
                    variant="bordered"
                    className="w-full"
                    isDisabled
                />
                <Input
                    label="Columna"
                    name="column"
                    type="number"
                    value={currentLocation.column?.toString()}
                    onChange={handleLocationInputChange}
                    variant="bordered"
                    className="w-full"
                    isDisabled
                />
                <Input
                    label="Cantidad"
                    name="quantity"
                    type="number"
                    value={currentLocation.quantity?.toString()}
                    onChange={handleLocationInputChange}
                    variant="bordered"
                    className="col-span-2"
                />
            </div>
            <Button
                color="primary"
                onPress={addLocation}
                startContent={<Plus className="w-4 h-4" />}
                className="w-full"
            >
                Agregar Ubicación
            </Button>
            {formData.location.length > 0 && (
                <div className="space-y-3 mt-4">
                    <h4 className="text-medium font-semibold">Ubicaciones agregadas:</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {formData.location.map((loc, index) => (
                            <Card key={index} className="bg-default-50">
                                <CardBody className="py-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge color="primary" variant="flat">
                                                {warehouses.find(w => w.id === loc.warehouseId)?.name}
                                            </Badge>
                                            <span className="text-small">
                                                Fila: {numberToLetter(loc.row)}, Columna: {loc.column}
                                            </span>
                                            <Badge color="secondary" variant="flat">
                                                Cantidad: {loc.quantity}
                                            </Badge>
                                        </div>
                                        <Button
                                            isIconOnly
                                            color="danger"
                                            variant="light"
                                            size="sm"
                                            onPress={() => removeLocation(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

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
                {(onClose) => (
                    <form onSubmit={handleSubmit} className="h-screen flex flex-col">
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                {isViewMode ? (
                                    <Eye className="w-6 h-6 text-primary" />
                                ) : selectedProduct ? (
                                    <Edit className="w-6 h-6 text-primary" />
                                ) : (
                                    <Plus className="w-6 h-6 text-primary" />
                                )}
                                <span className="text-xl font-semibold">
                                    {isViewMode ? 'Detalles del Producto' : selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                                </span>
                            </div>
                        </ModalHeader>

                        <ModalBody className="flex-grow overflow-hidden">
                            <div className="h-full grid grid-cols-2 gap-6">
                                <div className="overflow-y-auto pr-4 space-y-6">
                                    {renderBasicInfo()}
                                    <Divider />
                                    {renderCategorization()}
                                </div>
                                <div className="overflow-y-auto pr-4">
                                    {isViewMode ? (
                                        <>
                                            {renderInventoryInfo()}
                                            <div className="mt-4">
                                                <h4 className="text-medium font-semibold">Ubicaciones agregadas:</h4>
                                                {formData.location.map((loc, index) => (
                                                    <Card key={index} className="bg-default-50 mt-2">
                                                        <CardBody className="py-2">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <Badge color="primary" variant="flat">
                                                                    {warehouses.find(w => w.id === loc.warehouseId)?.name}
                                                                </Badge>
                                                                <span className="text-small">
                                                                    Fila: {numberToLetter(loc.row)}, Columna: {loc.column}
                                                                </span>
                                                                <Badge color="secondary" variant="flat">
                                                                    Cantidad: {loc.quantity}
                                                                </Badge>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        renderLocations()
                                    )}
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Cerrar
                            </Button>
                            {!isViewMode && (
                                <Button
                                    color="primary"
                                    type="submit"
                                    startContent={selectedProduct ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                >
                                    {selectedProduct ? 'Actualizar' : 'Crear'}
                                </Button>
                            )}
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}

