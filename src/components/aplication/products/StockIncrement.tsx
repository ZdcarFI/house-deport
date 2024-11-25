'use client'

import React, { useState, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { ProductContext } from '@/context/ProductContext/productContext';
import { ToastType } from '@/components/Toast/Toast';
import { PlusCircle } from 'lucide-react';

interface Props {
    showToast: (message: string, type: ToastType) => void;
}

export default function StockIncrementModal({ showToast }: Props) {
    const { isStockModalOpen , closeStockModal, selectedProduct, updateProduct } = useContext(ProductContext)!;
    const [incrementAmount, setIncrementAmount] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        try {
            const updatedStock = (selectedProduct.stockInventory || 0) + incrementAmount;
            await updateProduct(selectedProduct.id, {
                stockInventory: updatedStock,
                location: []
            });
            showToast("Stock incrementado exitosamente", ToastType.SUCCESS);
            closeStockModal();
        } catch (error) {
            showToast("Error al incrementar el stock:" + error, ToastType.ERROR);
        }
    };

    return (
        <Modal size='sm' isOpen={isStockModalOpen} onClose={closeStockModal}>
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <PlusCircle className="w-6 h-6 text-primary" />
                                <span className="text-xl font-semibold">Incrementar Stock</span>
                            </div>
                        </ModalHeader>

                        <ModalBody>
                            <div className="space-y-4">
                                <p>Stock actual: {selectedProduct?.stockInventory || 0}</p>
                                <Input
                                    label="Cantidad a incrementar"
                                    type="number"
                                    value={incrementAmount.toString()}
                                    onChange={(e) => setIncrementAmount(parseInt(e.target.value, 10))}
                                    isRequired
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit">
                                Incrementar
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
};

