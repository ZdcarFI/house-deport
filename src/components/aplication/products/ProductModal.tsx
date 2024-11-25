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
import { WarehouseDto } from '@/services/Dto/WarehouseDto';
import { Archive, Edit, Eye, Package, Plus, Trash2 } from 'lucide-react';
import { Badge, Divider } from '@nextui-org/react';

interface Props {
    showToast: (message: string, type: ToastType) => void;
}

export default function ProductModal({ showToast }: Props) {
    const { isModalOpen, closeModal, selectedProduct, isViewMode, createProduct, updateProduct } = useContext(ProductContext)!;
    const [formData, setFormData] = useState<CreateProductDto | UpdateProductDto>({
        name: '',
        code: '',
        price: 0,
        categoryId: 0,
        sizeId: 0,
        stockInventory: 0,
        location: [],
        stockStore: 0,
    });

    const {
        categories,
        openModal: ModalCategory
    } = useContext(CategoryContext)!;

    const {
        warehouses,
        openModal: ModalWarehouse
    } = useContext(WarehouseContext)!;

    // Estado para el manejo de ubicaciones
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [currentLocation, setCurrentLocation] = useState<Partial<LocationDto>>({
        row: 0,
        column: 0,
        quantity: 0,
        warehouseId: 0
    });

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                code: selectedProduct.code,
                price: selectedProduct.price,
                categoryId: selectedProduct.category ? selectedProduct.category.id : 0,
                sizeId: selectedProduct.size ? selectedProduct.size.id : 0,
                stockInventory: selectedProduct.stockInventory,
                stockStore: selectedProduct.stockStore,
                location: selectedProduct.productWarehouse || [],
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
                location: [],
            });
        }
    }, [selectedProduct]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'stockInventory' || name === 'stockStore' ? parseFloat(value) : value
        });
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({ ...formData, [name]: parseInt(value, 10) });
    };

    const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentLocation({
            ...currentLocation,
            [name]: parseInt(value, 10)
        });
    };

    const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const warehouseId = parseInt(e.target.value, 10);
        setSelectedWarehouse(e.target.value);
        setCurrentLocation({
            ...currentLocation,
            warehouseId
        });
    };

    const addLocation = () => {
        if (currentLocation.warehouseId && currentLocation.row !== undefined &&
            currentLocation.column !== undefined && currentLocation.quantity !== undefined) {

            // Verificar si la ubicación ya está ocupada
            const isLocationOccupied = formData.location.some(loc =>
                loc.warehouseId === currentLocation.warehouseId &&
                loc.row === currentLocation.row &&
                loc.column === currentLocation.column
            );

            if (isLocationOccupied) {
                showToast("Esta ubicación ya está ocupada", ToastType.ERROR);
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

            // Limpiar el formulario de ubicación
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
        if (!formData.categoryId) return []; // Retornar un arreglo vacío
        const category = categories.find((category) => category.id === formData.categoryId);
        if (!category?.sizes?.length) return []; // Retornar un arreglo vacío

        return category.sizes.map((size) => (
            <SelectItem key={size.id} value={size.id.toString()}>
                {size.name}
            </SelectItem>
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, formData as UpdateProductDto);
                showToast("Producto actualizado exitosamente", ToastType.SUCCESS);
            } else {
                await createProduct(formData as CreateProductDto);
                showToast("Producto creado exitosamente", ToastType.SUCCESS);
            }
            closeModal();
        } catch (error) {
            showToast("Error al enviar los datos del Producto:" + error, ToastType.ERROR)
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
    const handleAdd = () => {
        ModalWarehouse(null, false);
    }

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
                                {/* Columna izquierda */}
                                <div className="overflow-y-auto pr-4 space-y-6">
                                    {/* Información básica */}
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
                                            />
                                            <Input
                                                label="Código del producto"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                variant="bordered"
                                                isRequired
                                                isDisabled={isViewMode}
                                            />
                                            <Input
                                                label="Precio del producto"
                                                name="price"
                                                type="number"
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">$</span>
                                                    </div>
                                                }
                                                value={formData.price ? formData.price.toString() : ''}

                                                onChange={handleInputChange}
                                                variant="bordered"
                                                isRequired
                                                isDisabled={isViewMode}
                                            />
                                            <Input
                                                label="Stock en inventario"
                                                name="stockInventory"
                                                type="number"
                                                value={formData.stockInventory ? formData.stockInventory.toString() : ''}
                                                onChange={handleInputChange}
                                                variant="bordered"
                                                isRequired
                                                isDisabled={isViewMode}
                                            />
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Categorización */}
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
                                </div>

                                {/* Columna derecha - Ubicaciones en almacén */}
                                <div className="overflow-y-auto pr-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Archive className="w-5 h-5" />
                                            <h3 className="text-lg font-semibold">Ubicaciones en Almacén</h3>
                                        </div>

                                        <div className="flex gap-2">
                                            <Select
                                                label="Almacén"
                                                placeholder="Seleccione un almacén"
                                                value={selectedWarehouse}
                                                onChange={handleWarehouseChange}
                                                isDisabled={isViewMode}
                                                variant="bordered"
                                                className="flex-1"
                                            >
                                                {warehouses.map((warehouse) => (
                                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                        {warehouse.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Button
                                                color="primary"
                                                onPress={handleAdd}
                                                className="self-end"
                                                isDisabled={isViewMode}
                                            >
                                                Agregar Almacén
                                            </Button>
                                        </div>

                                        {/* Grid de inputs */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Fila"
                                                name="row"
                                                type="number"
                                                value={currentLocation.row?.toString()}
                                                onChange={handleLocationInputChange}
                                                isDisabled={isViewMode}
                                                variant="bordered"
                                                className="w-full"
                                            />

                                            <Input
                                                label="Columna"
                                                name="column"
                                                type="number"
                                                value={currentLocation.column?.toString()}
                                                onChange={handleLocationInputChange}
                                                isDisabled={isViewMode}
                                                variant="bordered"
                                                className="w-full"
                                            />

                                            <Input
                                                label="Cantidad"
                                                name="quantity"
                                                type="number"
                                                value={currentLocation.quantity?.toString()}
                                                onChange={handleLocationInputChange}
                                                isDisabled={isViewMode}
                                                variant="bordered"
                                                className="col-span-2"
                                            />
                                        </div>

                                        {!isViewMode && (
                                            <Button
                                                color="primary"
                                                onPress={addLocation}
                                                startContent={<Plus className="w-4 h-4" />}
                                                className="w-full"
                                            >
                                                Agregar Ubicación
                                            </Button>
                                        )}

                                        {/* Lista de ubicaciones */}
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
                                                                            Fila: {loc.row}, Columna: {loc.column}
                                                                        </span>
                                                                        <Badge color="secondary" variant="flat">
                                                                            Cantidad: {loc.quantity}
                                                                        </Badge>
                                                                    </div>
                                                                    {!isViewMode && (
                                                                        <Button
                                                                            isIconOnly
                                                                            color="danger"
                                                                            variant="light"
                                                                            size="sm"
                                                                            onPress={() => removeLocation(index)}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
};

