'use client'

import React, {useState, useEffect} from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/modal';
import {Button} from '@nextui-org/button';
import {Input} from '@nextui-org/input';
import {Select, SelectItem} from '@nextui-org/select';
import {ProductDto} from '@/services/Dto/ProductDto';
import {CreateProductDto} from '@/services/Product/dto/CreateProductDto';
import {UpdateProductDto} from '@/services/Product/dto/UpdateProductDto';
import {CategoryContext} from "@/context/CategoryContext/categoryContext";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: CreateProductDto | UpdateProductDto) => void;
    product: ProductDto | null;
    isViewMode: boolean;
}

export default function ProductModal({isOpen, onClose, onSubmit, product, isViewMode}: ProductModalProps) {
    const [formData, setFormData] = useState<CreateProductDto | UpdateProductDto>({
        name: '',
        code: '',
        price: 0,
        categoryId: 0,
        sizeId: 0,
        stockInventory: 0,
        stockStore: 0,
    });

    const {
        categories,
    } = React.useContext(CategoryContext)!;

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                code: product.code,
                price: product.price,
                categoryId: product.category ? product.category.id : 0,
                sizeId: product.size ? product.size.id : 0,
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
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'stockInventory' || name === 'stockStore' ? parseFloat(value) : value
        });
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({...formData, [name]: parseInt(value, 10)});
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
                        {isViewMode ? 'Ver producto' : product ? 'Editar Producto' : 'Agregar Producto'}
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre del producto"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            isDisabled={isViewMode}
                        />
                        <Input
                            label="Código del producto"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            required
                            isDisabled={isViewMode}
                        />
                        <Input
                            label="Precio del producto"
                            name="price"
                            type="number"
                            value={formData.price.toString()}
                            onChange={handleInputChange}
                            required
                            isDisabled={isViewMode}
                          
                        />
                        <Select
                            label="Categoría del producto"
                            name="categoryId"
                            placeholder="Seleccione una categoría"
                            onChange={(e) => handleSelectChange('categoryId')(e.target.value)}
                            selectedKeys={formData.categoryId ? [formData.categoryId.toString()] : []}
                            isDisabled={isViewMode}
                        >
                            {categories.map((category) => (
                                <SelectItem key={category.id}>
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
                            {formData.categoryId && categories.find((category) => category.id === formData.categoryId)?.sizes.map((size) => (
                                <SelectItem key={size.id} value={size.id.toString()}>
                                    {size.name}
                                </SelectItem>
                            )) || []}
                        </Select>
                        <Input
                            label="Stock en el inventario"
                            name="stockInventory"
                            type="number"
                            value={formData.stockInventory.toString()}
                            onChange={handleInputChange}
                            required
                            isDisabled={isViewMode}
                        />
                        <Input
                            label="Stock en los almacenes"
                            name="stockStore"
                            type="number"
                            value={formData.stockStore.toString()}
                            onChange={handleInputChange}
                            required
                            isDisabled={isViewMode}
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