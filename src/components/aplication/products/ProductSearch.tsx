import React, {useState} from 'react';
import {Input} from '@nextui-org/input';
import {Card, CardBody} from '@nextui-org/card';
import {ProductDto} from '@/services/Dto/ProductDto';
import {ToastType} from '@/components/Toast/Toast';
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {DataCartDto} from "@/components/aplication/orders/dto/DataCartDto";
import {initialCart} from "@/components/aplication/orders/CreateOrder";

interface ProductSearchProps {
    products: ProductDto[];
    isViewMode: boolean;
    isProductDisabled: boolean;
    showToast: (message: string, type: ToastType) => void;
    onProductSelect: (productId: number) => void;
    selectedProduct?: ProductDto;
    onQuantityChange: (value: number) => void;
    quantity: number;
    quantityError?: string;
    boolean: boolean;
}


export default function ProductSearch({
                                          products,
                                          onProductSelect,
                                          onQuantityChange,
                                          selectedProduct,
                                          quantity,
                                          quantityError,
                                          boolean
                                      }: ProductSearchProps) {


    const [newCart, setNewCart] = useState<DataCartDto>(initialCart);


    const onSelectionChangeProduct = (id: React.Key | null) => {
        if(id){
            onProductSelect(parseInt(id.toString()));
        }
    };


    return (
        <Card className="p-4">
            <CardBody className="space-y-4">
                <div className="space-y-4">
                    <Autocomplete
                        allowsCustomValue={true}
                        defaultItems={products}
                        onSelectionChange={onSelectionChangeProduct}
                        aria-label="Select a product"
                        inputValue={newCart.name}
                        onInputChange={(value) => setNewCart({
                            ...newCart,
                            name: value
                        })}
                    >
                        {products.map((product) => (
                            <AutocompleteItem key={product.id} value={product.id}>
                                {`${product.name} | Talla: ${product.size.name} | Codigo: ${product.code}`}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>

                {selectedProduct && (
                    <div className="mt-4 space-y-4">
                        <span className="font-bold text-blue-600">Datos del producto:</span>
                        <Input
                            label="Nombre"
                            value={selectedProduct.name}
                            isDisabled
                        />
                        <Input
                            label="Código"
                            value={selectedProduct.code}
                            isDisabled
                        />
                        <div className="grid grid-cols-2 gap-x-4">
                            <Input
                                label="Categoría"
                                value={selectedProduct.category?.name || ''}
                                isDisabled
                            />
                            <Input
                                label="Talla"
                                value={selectedProduct.size?.name || ''}
                                isDisabled
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                            <Input
                                label="Precio"
                                value={selectedProduct.price?.toString() || ''}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">S/.</span>
                                    </div>
                                }
                                isDisabled
                            />
                            <Input
                                label="Cantidad en el inventario"
                                value={selectedProduct.stockInventory?.toString() || ''}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Unidades:</span>
                                    </div>
                                }
                                isDisabled
                            />
                        </div>

                    </div>
                )}

                {selectedProduct && (
                    <Input
                        label={boolean ? "Escriba la cantidad que se va enviar al almacen" : "Escriba la cantidad de produccion"}
                        type="number"
                        value={quantity.toString()}
                        onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                        required
                        max={boolean ? selectedProduct.stockInventory : 10000}
                        isInvalid={boolean ? quantity > selectedProduct.stockInventory : quantity > 10000}
                        errorMessage={boolean ? "La cantidad a enviar no puede ser mayor a la cantidad en el inventario" : "La cantidad de produccion no puede ser mayor a 10000"}
                    />
                )}
            </CardBody>
        </Card>
    );
}