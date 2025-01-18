'use client'
import React, {useState, useEffect, useContext} from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/modal';
import {Button} from '@nextui-org/button';
import {Select, SelectItem} from "@nextui-org/select";
import {ProductionContext} from '@/context/ProductionContext/productionContext';
import {UpdateProductionDto} from '@/services/Production/dto/UpdateProductionDto';
import {CreateProductionDto} from '@/services/Production/dto/CreateProductionDto';
import {ProductContext} from "@/context/ProductContext/productContext";
import {ToastType} from '@/components/Toast/Toast';
import {ProductDto} from "@/services/Dto/ProductDto";
import {Input} from "@nextui-org/input";

interface Props {
    showToast: (message: string, type: ToastType) => void;
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

    const {getProducts} = useContext(ProductContext)!;

    const [formData, setFormData] = useState({
        quantity: 0,
        productId: 0,
        status: 'completed' as const
    });

    const [quantityError, setQuantityError] = useState("");
    const [productSelected, setProductSelected] = useState<ProductDto | undefined>(undefined);

    useEffect(() => {
        // Listen for product selection from the table
        const handleProductSelect = (event: CustomEvent) => {
            const product = event.detail;
            setProductSelected(product);
            setFormData(prev => ({...prev, productId: product.id}));
        };

        window.addEventListener('selectProduct', handleProductSelect as EventListener);
        return () => {
            window.removeEventListener('selectProduct', handleProductSelect as EventListener);
        };
    }, []);

    useEffect(() => {
        if (selectedProduction) {
            setFormData({
                status: selectedProduction.status as 'completed',
                productId: selectedProduction.product?.id || 0,
                quantity: selectedProduction.quantity || 0
            });
        } else {
            setFormData({
                quantity: 0,
                productId: 0,
                status: 'completed'
            });
        }
    }, [selectedProduction]);

    const handleQuantityChange = (value: string) => {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 0) {
            setQuantityError("La cantidad debe ser mayor a 0");
        } else {
            setQuantityError("");
            setFormData(prev => ({...prev, quantity: numValue}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (quantityError || !formData.productId) {
            showToast("Por favor ingrese algun valor", ToastType.ERROR);
            return;
        }

        try {
            const userLog = JSON.parse(localStorage.getItem('user') || 'null');

            if (selectedProduction) {
                const updateData: UpdateProductionDto = {
                    status: formData.status,
                    user_receive_orderId: userLog?.id
                };
                await updateProduction(selectedProduction.id, updateData);
            } else {
                const createData: CreateProductionDto = {
                    quantity: formData.quantity,
                    productId: formData.productId,
                    user_orderId: userLog?.id,
                };
                await createProduction(createData);
            }

            await getProducts();
            showToast(
                selectedProduction ? "Producción actualizada exitosamente" : "Producción creada exitosamente",
                ToastType.SUCCESS
            );
            closeModal();
        } catch (error) {
            showToast(
                "Error al procesar la producción: " + (error instanceof Error ? error.message : String(error)),
                ToastType.ERROR
            );
        }
    };

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal} scrollBehavior="inside" size="2xl">
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>
                        <h2>{isViewMode ? 'Ver producción' : selectedProduction ? 'Editar Producción' : 'Agregar Producción'}</h2>
                    </ModalHeader>
                    <ModalBody>
                        {productSelected && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium">Producto:</p>
                                        <p>{productSelected.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Código:</p>
                                        <p>{productSelected.code}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Categoría:</p>
                                        <p>{productSelected.category?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Talla:</p>
                                        <p>{productSelected.size?.name}</p>
                                    </div>
                                </div>

                                <Input
                                    type="number"
                                    label="Cantidad"
                                    placeholder="Ingrese la cantidad"
                                    value={formData.quantity.toString()}
                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                    errorMessage={quantityError}
                                    isRequired
                                />
                            </div>
                        )}

                        {selectedProduction && (
                            <Select
                                label="Estado de producción"
                                placeholder="Seleccione el estado de producción"
                                selectedKeys={formData.status ? [formData.status] : []}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.value as 'completed'
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
                            Cerrar
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