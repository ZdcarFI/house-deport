"use client"

import React, {useState, useEffect, useContext} from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/modal';
import {Button} from '@nextui-org/button';
import {Select, SelectItem} from "@nextui-org/select";

import {ProductionContext} from '@/context/ProductionContext/productionContext';
import {UpdateProductionDto} from '@/services/Production/dto/UpdateProductionDto';
import {CreateProductionDto} from '@/services/Production/dto/CreateProductionDto';
import {ProductContext} from "@/context/ProductContext/productContext";
import {ToastType} from '@/components/Toast/Toast';
import ProductSearch from "@/components/aplication/products/ProductSearch";

interface Props {
    showToast: (message: string, type: ToastType) => void;
}

interface ProductionFormData {
    quantity?: number;
    productId?: number;
    status?: 'pending' | 'completed' | 'canceled';
    user_orderId?: number;
    user_receive_orderId?: number;
}

export default function ProductionModal({showToast}: Props) {
    const {
        isModalOpen,
        closeModal,
        selectedProduction,
        isViewMode,
        createProduction,
        updateProduction,
    } = useContext(ProductionContext)!;

    const {products} = useContext(ProductContext)!;

    const [formData, setFormData] = useState<ProductionFormData>({
        quantity: 0,
        productId: 0,
        status: 'pending'
    });

    const [quantityError, setQuantityError] = useState<string>("");

    useEffect(() => {
        if (selectedProduction) {
            setFormData({
                status: selectedProduction.status as 'pending' | 'completed' | 'canceled',
                productId: selectedProduction.product?.id,
                quantity: selectedProduction.quantity
            });
        } else {
            setFormData({
                quantity: 0,
                productId: 0,
                status: 'pending'
            });
        }
    }, [selectedProduction]);

    const handleQuantityChange = (value: number) => {
        if (value < 0) {
            setQuantityError("La cantidad debe ser mayor a 0");
        } else {
            setQuantityError("");
        }
        setFormData(prev => ({...prev, quantity: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (quantityError) {
            showToast("Por favor corrija los errores de validación", ToastType.ERROR);
            return;
        }

        try {
            const userLog = JSON.parse(localStorage.getItem('user') || 'null');

            if (selectedProduction) {
                const updateData: UpdateProductionDto = {
                    status: formData.status,
                    user_receive_orderId: userLog?.id || formData.user_receive_orderId
                };
                await updateProduction(selectedProduction.id, updateData);
                showToast("Production updated successfully", ToastType.SUCCESS);
            } else {
                const createData: CreateProductionDto = {
                    quantity: formData.quantity!,
                    productId: formData.productId!,
                    user_orderId: userLog?.id!,
                };
                await createProduction(createData);
                showToast("Production created successfully", ToastType.SUCCESS);
            }
            closeModal();
        } catch (error) {
            showToast("Error submitting production data: " + (error instanceof Error ? error.message : String(error)), ToastType.ERROR);
        }
    };

    const getSelectedProduct = () => {
        return products.find(p => p.id === formData.productId);
    };
    const boolean = false
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            scrollBehavior="inside"
            size="2xl"
        >
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>
                        <h2>{isViewMode ? 'Ver produccion' : selectedProduction ? 'Editar Produccion' : 'Agregar Produccion'}</h2>
                    </ModalHeader>
                    <ModalBody>
                        {!selectedProduction && (
                            <ProductSearch
                                boolean={boolean}
                                products={products}
                                isViewMode={isViewMode}
                                isProductDisabled={false}
                                showToast={showToast}
                                onProductSelect={(productId) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        productId
                                    }));
                                }}
                                selectedProduct={getSelectedProduct()}
                                onQuantityChange={handleQuantityChange}
                                quantity={formData.quantity || 0}
                                quantityError={quantityError}
                            />
                        )}
                        {selectedProduction && (
                            <Select
                                label="Estado de produccion"
                                placeholder="Seleccion el estado de produccion"
                                selectedKeys={formData.status ? [formData.status] : []}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.value as 'pending' | 'completed' | 'canceled'
                                }))}
                                isRequired
                                isDisabled={isViewMode}
                            >
                                <SelectItem key="completed" value="completed">Completado</SelectItem>
                                <SelectItem key="canceled" value="canceled">Cancelar</SelectItem>
                            </Select>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={closeModal}>
                            Close
                        </Button>
                        {!isViewMode && (
                            <Button color="primary" type="submit">
                                {selectedProduction ? 'Actualizar' : 'Crear'}
                            </Button>
                        )}
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}