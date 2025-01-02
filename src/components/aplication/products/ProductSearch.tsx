import React, {useState} from 'react';
import {Button} from '@nextui-org/button';
import {Input} from '@nextui-org/input';
import {Select, SelectItem} from "@nextui-org/select";
import {Card, CardBody} from '@nextui-org/card';
import {ProductDto} from '@/services/Dto/ProductDto';
import {ToastType} from '@/components/Toast/Toast';

interface ProductSearchProps {
    products: ProductDto[];
    isViewMode: boolean;
    isProductDisabled: boolean;
    showToast: (message: string, type: ToastType) => void;
    onProductSelect: (productId: number, maxQuantity: number) => void;
    selectedProduct?: ProductDto;
    onQuantityChange: (value: number) => void;
    quantity: number;
    quantityError?: string;
    boolean: boolean;
}

interface ProductSearchState {
    searchByCode: boolean;
    code: string;
    searchTerm: string;
    searchResults: ProductDto[];
}

export default function ProductSearch({
                                          products,
                                          isViewMode,
                                          isProductDisabled,
                                          showToast,
                                          onProductSelect,
                                          selectedProduct,
                                          onQuantityChange,
                                          quantity,
                                          quantityError,
                                          boolean
                                      }: ProductSearchProps) {
    const [searchState, setSearchState] = useState<ProductSearchState>({
        searchByCode: true,
        code: '',
        searchTerm: '',
        searchResults: []
    });

    const handleCodeSearch = (code: string) => {
        if (code.length > 12) {
            showToast("El código no puede tener más de 12 caracteres", ToastType.WARNING);
            return;
        }

        setSearchState(prev => ({...prev, code}));

        if (!code.trim()) {
            setSearchState(prev => ({...prev, searchResults: []}));
            onProductSelect(0, 0);
            return;
        }

        const matchingProducts = products.filter(p =>
            p.code.toLowerCase().includes(code.toLowerCase().trim())
        );

        if (matchingProducts.length > 0) {
            setSearchState(prev => ({...prev, searchResults: matchingProducts}));

            const exactMatch = matchingProducts.find(p =>
                p.code.toLowerCase() === code.toLowerCase()
            );

            if (exactMatch) {
                onProductSelect(exactMatch.id, exactMatch.stockInventory);
            }
        } else {
            setSearchState(prev => ({...prev, searchResults: []}));
            if (code.length > 0) {
                showToast("No se encontraron coincidencias con ningún producto", ToastType.ERROR);
            }
        }
    };

    const handleSearch = (searchTerm: string) => {
        setSearchState(prev => ({...prev, searchTerm}));

        if (searchTerm.length >= 2) {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.price.toString().includes(searchTerm)
            );
            setSearchState(prev => ({...prev, searchResults: results}));
        } else {
            setSearchState(prev => ({...prev, searchResults: []}));
        }
    };

    return (
        <Card className="p-4">
            <CardBody className="space-y-4">
                {!isViewMode && !isProductDisabled && (
                    <>
                        <div className="flex gap-4 mb-4">
                            <Button
                                color={searchState.searchByCode ? "primary" : "default"}
                                onClick={() => {
                                    setSearchState(prev => ({
                                        ...prev,
                                        searchByCode: true,
                                        code: '',
                                        searchResults: []
                                    }));
                                    onProductSelect(0, 0);
                                }}
                            >
                                Buscar por código
                            </Button>
                            <Button
                                color={!searchState.searchByCode ? "primary" : "default"}
                                onClick={() => {
                                    setSearchState(prev => ({
                                        ...prev,
                                        searchByCode: false,
                                        searchTerm: '',
                                        searchResults: []
                                    }));
                                    onProductSelect(0, 0);
                                }}
                            >
                                Buscar por filtros
                            </Button>
                        </div>

                        {searchState.searchByCode ? (
                            <div className="space-y-4">
                                <Input
                                    label="Código del producto"
                                    value={searchState.code}
                                    onChange={(e) => handleCodeSearch(e.target.value)}
                                    maxLength={12}
                                    placeholder="Ingrese el código del producto"
                                />

                                {searchState.searchResults.length > 0 && !selectedProduct && (
                                    <Select
                                        label="Productos encontrados"
                                        placeholder="Seleccione un producto"
                                        onChange={(e) => {
                                            const selected = products.find(p => p.id === parseInt(e.target.value));
                                            if (selected) {
                                                onProductSelect(selected.id, selected.stockInventory);
                                                setSearchState(prev => ({
                                                    ...prev,
                                                    code: selected.code
                                                }));
                                            }
                                        }}
                                    >
                                        {searchState.searchResults.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {`${product.code} - ${product.name} - ${product.category.name} - ${product.size.name}`}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Input
                                    label="Buscar producto"
                                    value={searchState.searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Buscar por nombre, categoría, talla o precio"
                                />

                                {searchState.searchResults.length > 0 && (
                                    <Select
                                        label="Seleccionar producto"
                                        placeholder="Seleccione un producto"
                                        onChange={(e) => {
                                            const selected = products.find(p => p.id === parseInt(e.target.value));
                                            if (selected) {
                                                onProductSelect(selected.id, selected.stockInventory);
                                            }
                                        }}
                                    >
                                        {searchState.searchResults.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {`${product.name} - ${product.category.name} - ${product.size.name} - $${product.price}`}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            </div>
                        )}
                    </>
                )}

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
                        errorMessage={quantityError}
                        isInvalid={!!quantityError}
                    />
                )}
            </CardBody>
        </Card>
    );
}