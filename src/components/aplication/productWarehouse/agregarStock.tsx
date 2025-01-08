'use client'

import React, {useContext, useState} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/modal"
import {Button} from "@nextui-org/button"
import {Input} from "@nextui-org/input"
import {ProductWarehouseContext} from "@/context/ProductWarehouseContext/productWarehouseContext"
import {ProductContext} from "@/context/ProductContext/productContext"
import {ToastContext} from "@/context/ToastContext/ToastContext"
import {ToastType} from "@/components/Toast/Toast"
import {ProductWarehouseDto} from "@/services/Dto/ProductWarehouseDto"

interface UpdateProductWarehouseDto {
    readonly productId: number;
    readonly warehouseId: number;
    readonly quantity: number;
    readonly row: number;
    readonly column: number;
}

interface AgregarStockProps {
    productWarehouse: ProductWarehouseDto ;
}

export default function AgregarStock({
                                         productWarehouse,
                                     }: AgregarStockProps) {
    const {
        updateProductWarehouse,
    } = useContext(ProductWarehouseContext)!;

    const {getProduct} = useContext(ProductContext)!;
    const [isOpen, setIsOpen] = useState(false)
    const [additionalStock, setAdditionalStock] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentQuantity, setCurrentQuantity] = useState<number>(productWarehouse.quantity)
    const [availableStock, setAvailableStock] = useState<number>(
        productWarehouse.product?.stockInventory || 0
    )

    const handleOpen = async () => {
        setIsOpen(true)
        if (productWarehouse.productId) {
            const updatedProduct = await getProduct(productWarehouse.productId)
            if (updatedProduct) {
                setAvailableStock(updatedProduct.stockInventory || 0)
                setCurrentQuantity(productWarehouse.quantity)
            }
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        setAdditionalStock(0)
    }

    const {showToast} = useContext(ToastContext)!;

    const validateStock = (): boolean => {
        if (additionalStock > availableStock) {
            showToast(
                "La cantidad adicional no puede ser mayor que el inventario disponible",
                ToastType.ERROR
            );
            return false;
        }

        if (additionalStock <= 0) {
            showToast("La cantidad debe ser mayor que 0", ToastType.ERROR);
            return false;
        }

        return true;
    }

    const handleAddStock = async () => {
        if (!validateStock()) return;

        try {
            setIsSubmitting(true);

            const updateData: UpdateProductWarehouseDto = {
                productId: productWarehouse.productId!,
                warehouseId: productWarehouse.warehouseId!,
                quantity: currentQuantity + additionalStock,
                row: productWarehouse.row!,
                column: productWarehouse.column!
            };
            await updateProductWarehouse(productWarehouse.id, updateData);
            showToast("Stock actualizado exitosamente", ToastType.SUCCESS);
            handleClose();
        } catch (error) {
            showToast("Error al actualizar el stock: " + error, ToastType.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Button
                size="sm"
                color="success"
                onPress={handleOpen}
                className="min-w-unit-20"
            >
                Agregar Stock
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Agregar Stock
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-6">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            Producto: <span
                                            className="text-gray-600 dark:text-gray-300">{productWarehouse.product?.name}</span>
                                        </p>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            Almacén: <span
                                            className="text-gray-600 dark:text-gray-300">{productWarehouse.warehouse?.name}</span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            className="bg-green-50 dark:bg-green-900 border-l-4 border-green-400 dark:border-green-500 p-4 rounded-lg shadow">
                                            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                                Cantidad Actual:
                                            </p>
                                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                                {currentQuantity}
                                            </p>
                                        </div>
                                        <div
                                            className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-500 p-4 rounded-lg shadow">
                                            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                                Cantidad Disponible:
                                            </p>
                                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                {availableStock}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Cantidad Adicional
                                        </label>
                                        <Input
                                            label="Cantidad adicional"
                                            placeholder="Ingresa la cantidad"
                                            type="number"
                                            min={0}
                                            max={availableStock}
                                            value={additionalStock.toString()}
                                            onChange={(e) => setAdditionalStock(Number(e.target.value) || 0)}
                                            isDisabled={isSubmitting}
                                            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                    isDisabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="success"
                                    onPress={handleAddStock}
                                    isLoading={isSubmitting}
                                >
                                    Agregar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

