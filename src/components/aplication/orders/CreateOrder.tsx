'use client'

import React, {useEffect, useState} from 'react'
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {ProductContext} from '@/context/ProductContext/productContext';
import {ClientContext} from '@/context/ClientContext/clientContext';
import {CreateOrderDto, ProductBasicCreateDto} from '@/services/Order/dto/CreateOrderDto';
import {OrderContext} from '@/context/OrderContext/orderContext';
import {Minus, Plus} from 'lucide-react';
import {UserContext} from "@/context/UserContext/userContext";
import {CirclePlus} from "@/components/icons/CirclePlus";
import {ClientDto} from "@/services/Dto/ClienDto";
import ClientModal from "@/components/aplication/clients/ClientModal";
import {ProductDto, ProductWarehouseBasicDto} from "@/services/Dto/ProductDto";
import {CheckIcon} from "@/components/icons/CheckIcon";
import {ToastContext} from "@/context/ToastContext/ToastContext";
import {ToastType} from "@/components/Toast/Toast";
import {SizeDto} from "@/services/Dto/SizeDto";
import {CategoryBasicDto} from "@/services/Dto/CategoryDto";

export default function CreateOrderPage() {
    const {products, getProducts, productInitial} = React.useContext(ProductContext)!
    const {user} = React.useContext(UserContext)!
    const {
        showToast
    } = React.useContext(ToastContext)!
    const {
        clients,
        createClient
    } = React.useContext(ClientContext)!
    const {createOrder} = React.useContext(OrderContext)!

    const [selectedProduct, setSelectedProduct] = useState<ProductDto>(productInitial);
    const [quantity, setQuantity] = useState(0);
    const [location, setLocation] = useState<ProductWarehouseBasicDto | null>(null);
    const [cart, setCart] = useState<ProductBasicCreateDto[]>([])
    const [orderData, setOrderData] = useState<CreateOrderDto & {
        status: string,
        tax: number,
        discount: number,
        subtotal: number,
        paymentType: string
    }>({
        numFac: '',
        clientId: 0,
        userId: user?.id || 0,
        products: [],
        status: 'pending',
        tax: 18,
        discount: 0,
        subtotal: 0,
        paymentType: '',
    })

    const [total, setTotal] = useState(0)
    const [selectedClient, setSelectedClient] = React.useState<ClientDto | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isViewMode, setIsViewMode] = React.useState(false);

    useEffect(() => {
        getProducts();
    }, [])


    useEffect(() => {
        calculateTotals()
    }, [cart, orderData.tax, orderData.discount])

    const handleQuantityChange = (id: number, change: number) => {
        const product = products.find(p => p.id === id)
        if (product) {
            setCart(cart.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, Math.min(item.quantity + change, product.stockStore))
                    return {...item, quantity: newQuantity}
                }
                return item
            }))
        }
    }

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const calculateTotals = () => {
        const newSubtotal = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id)
            return sum + (product ? product.price * item.quantity : 0)
        }, 0)

        setTotal(newSubtotal)
        setOrderData(prev => ({...prev, subtotal: newSubtotal, products: cart}))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log(orderData);

        try {
            await createOrder(orderData)
            // Handle successful order creation (e.g., show success message, redirect)
        } catch (error) {
            console.error("Error creating order:", error)
            // Handle error (e.g., show error message)
        }
    }

    const handleSelectChange = (name: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderData(prev => ({...prev, [name]: Number(e.target.value)}))
    }

    const handleAdd = () => {
        setSelectedClient(null);
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const handleSubmitClient = async (formData: ClientDto) => {
        try {
            const newClient = await createClient(formData);
            setOrderData({...orderData, clientId: newClient.id});
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting client data:", error);
        }
    };

    const onSelectionChangeProduct = (id: React.Key | null) => {
        if (id) {
            const product = products.find(p => p.id === Number(id));
            if (product) {
                setSelectedProduct(product);
                setInputValue(product.name);
            }
        } else {
            setInputValue('');
        }
        setLocation(null);
    };

    const addProductToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (validateAddProductToCart()) {
            const existingProduct = cart.find(item => item.id === selectedProduct.id)
            if (existingProduct) {
                if (existingProduct.quantity > 0 && existingProduct.quantity < selectedProduct.stockStore) {
                    setCart(cart.map(item =>
                        item.id === selectedProduct?.id ? {...item, quantity: item.quantity + quantity} : item
                    ))
                }
            } else {
                setCart([...cart, {
                    id: selectedProduct.id,
                    quantity: quantity,
                    productWarehouseId: selectedProduct.productWarehouse[0].warehouseId
                }])
            }

            setSelectedProduct(productInitial);
            setQuantity(0);
            setInputValue('');
            setLocation(null);
        }
    }

    function validateAddProductToCart(): boolean {
        if (selectedProduct.id === 0) {
            showToast("Debe seleccionar un producto", ToastType.ERROR);
            return false;
        } else if (quantity <= 0) {
            showToast("La cantidad no puede ser menor o igual a 0", ToastType.ERROR);
            return false;
        } else if (location != null && quantity > location.quantity) {
            showToast("No hay suficiente stock en la ubicación seleccionada", ToastType.ERROR);
            return false;
        }
        return true;
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Nueva Orden</h1>
            <div>
                {/*<div>
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Product Selection</h2>
                        </CardHeader>
                        <CardBody>
                            <div className="flex gap-2 mb-4">
                                <Select
                                    label="Category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {[
                                        <SelectItem key="all" value="">All Categories</SelectItem>,
                                        ...categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))
                                    ]}
                                </Select>
                                <Select
                                    label="Size"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    {[
                                        <SelectItem key="all" value="">
                                            All Sizes
                                        </SelectItem>,
                                        ...sizes.map((size) => (
                                            <SelectItem key={size.id} value={size.id.toString()}>
                                                {size.name}
                                            </SelectItem>
                                        )),
                                    ]}
                                </Select>

                            </div>
                            <Input
                                label="Search Product"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-4"
                            />
                            <div className="h-96 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="p-2 border-b cursor-pointer hover:bg-gray-100"
                                        onDoubleClick={() => handleProductDoubleClick(product)}>
                                        <p>{product.name}</p>
                                        <p className="text-sm text-gray-600">Stock: {product.stockStore}</p>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>*/}
                <div>
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Detalle de la venta</h2>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm" htmlFor="">Número de Factura</label>
                                        <Input
                                            placeholder="F0001"
                                            value={orderData.numFac}
                                            onChange={(e) => setOrderData({...orderData, numFac: e.target.value})}
                                            className="mb-2"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <label className="text-sm" htmlFor="">Cliente</label>
                                            <div className="flex gap-1 items-center cursor-pointer"
                                                 style={{color: "#f31260"}} onClick={handleAdd}>
                                                <CirclePlus color="#f31260" size="16"/>
                                                <label className="text-sm cursor-pointer" htmlFor="">Agregar
                                                    Cliente</label>
                                            </div>
                                        </div>
                                        <Select
                                            value={orderData.clientId.toString()}
                                            onChange={handleSelectChange('clientId')}
                                            placeholder="Elegir"
                                            className="mb-2"
                                            aria-label="Select a client"
                                        >
                                            {clients.map((client) => (
                                                <SelectItem
                                                    key={client.id}
                                                    value={client.id.toString()}
                                                    textValue={`${client.firstName} ${client.lastName}`}>
                                                    {client.firstName} {client.lastName}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm" htmlFor="">Tipo de pago</label>
                                        <Select
                                            placeholder="Elegir"
                                            value={orderData.paymentType}
                                            onChange={(e) => setOrderData({...orderData, paymentType: e.target.value})}
                                            className="mb-2"
                                            aria-label="Select a payment type"
                                        >
                                            <SelectItem key="cash" value="cash">Efectivo</SelectItem>
                                            <SelectItem key="transfers" value="transfers">Transferencias</SelectItem>
                                            <SelectItem key="yape" value="yape">Yape</SelectItem>
                                        </Select>
                                    </div>
                                </div>
                                {/*<div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={enableTax}
                                        onChange={(e) => setEnableTax(e.target.checked)}
                                    />
                                    <label>Enable Tax</label>
                                    {enableTax && (
                                        <Input
                                            type="number"
                                            label="Tax (%)"
                                            value={orderData.tax.toString()}
                                            onChange={(e) => setOrderData({
                                                ...orderData,
                                                tax: parseFloat(e.target.value)
                                            })}
                                        />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={enableDiscount}
                                        onChange={(e) => setEnableDiscount(e.target.checked)}
                                    />
                                    <label>Enable Discount</label>
                                    {enableDiscount && (
                                        <Input
                                            type="number"
                                            label="Discount"
                                            value={orderData.discount.toString()}
                                            onChange={(e) => setOrderData({
                                                ...orderData,
                                                discount: parseFloat(e.target.value)
                                            })}
                                        />
                                    )}
                                </div>*/}
                                <div className="mt-4">
                                    <h3 className="font-semibold">Productos</h3>

                                    <Table aria-label="Cart items">
                                        <TableHeader>
                                            <TableColumn>Producto</TableColumn>
                                            <TableColumn>Precio</TableColumn>
                                            <TableColumn>Tamaño</TableColumn>
                                            <TableColumn>Categoria</TableColumn>
                                            <TableColumn>Ubicación</TableColumn>
                                            <TableColumn>Cantidad</TableColumn>
                                            <TableColumn>Acción</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                <TableRow key="newProduct">
                                                    <TableCell>
                                                        <Autocomplete
                                                            allowsCustomValue={true}
                                                            defaultItems={products}
                                                            onSelectionChange={onSelectionChangeProduct}
                                                            aria-label="Select a product"
                                                            inputValue={inputValue}
                                                            onInputChange={(value) => setInputValue(value)}
                                                        >
                                                            {products.map((product) => (
                                                                <AutocompleteItem key={product.id} value={product.id}>
                                                                    {product.name}
                                                                </AutocompleteItem>
                                                            ))}
                                                        </Autocomplete>
                                                    </TableCell>
                                                    <TableCell>{selectedProduct?.price}</TableCell>
                                                    <TableCell>{selectedProduct?.size?.name}</TableCell>
                                                    <TableCell>{selectedProduct?.category?.name}</TableCell>
                                                    <TableCell
                                                        className="min-w-60">
                                                        <Select
                                                            value={location?.id.toString() || ''}
                                                            onChange={(e) => {
                                                                const location = selectedProduct?.productWarehouse.find((product) => product.id === parseInt(e.target.value));
                                                                setLocation(location || null);
                                                            }}
                                                            aria-label="Select a product location"
                                                            isDisabled={selectedProduct.id === 0}
                                                            required={true}
                                                        >
                                                            {selectedProduct?.productWarehouse?.map((product) => (
                                                                <SelectItem
                                                                    key={product.id}
                                                                    value={product.id.toString()}
                                                                    textValue={`${product.row}-${product.column}`}
                                                                    color={product.color}
                                                                >
                                                                    {product.name}--{product.row}-{product.column}
                                                                </SelectItem>
                                                            )) || (
                                                                <SelectItem key="no-product-warehouse" value=""
                                                                            textValue="No products available">
                                                                    No products available
                                                                </SelectItem>
                                                            )}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={quantity.toString()}
                                                            onChange={
                                                                (e) => setQuantity(parseInt(e.target.value))
                                                            }
                                                            type={"number"}
                                                            className="mb-2"
                                                            isDisabled={selectedProduct.id === 0}
                                                            aria-label="Quantity"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onClick={addProductToCart}
                                                            className=""
                                                            isIconOnly
                                                            color="success"
                                                            aria-label="Like"
                                                            isDisabled={selectedProduct.id === 0}>
                                                            <CheckIcon color="white"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>,
                                                ...cart
                                                    .filter((item) => products.some((p) => p.id === item.id))
                                                    .map((item) => {
                                                        const product = products.find((p) => p.id === item.id);
                                                        const location = product?.productWarehouse.find((product) => product.id === item.productWarehouseId);

                                                        return (
                                                            <TableRow key={item.id}>
                                                                <TableCell>{product?.name}</TableCell>
                                                                <TableCell>{product?.price}</TableCell>
                                                                <TableCell>{product?.size.name}</TableCell>
                                                                <TableCell>{product?.category.name}</TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        className="w-full"
                                                                        color={location?.color}
                                                                    >
                                                                        {location?.name}{" "}{location?.row}-{location?.column}
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        <Button
                                                                            size="sm"
                                                                            isIconOnly
                                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                                        >
                                                                            <Minus size={16}/>
                                                                        </Button>
                                                                        <span className="mx-2">{item.quantity}</span>
                                                                        <Button
                                                                            size="sm"
                                                                            isIconOnly
                                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                                        >
                                                                            <Plus size={16}/>
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        color="danger"
                                                                        onClick={() => removeFromCart(item.id)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                            ]}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4 flex flex-col justify-end gap-2 items-end">
                                    <p>Subtotal: S/.{(total * 0.82).toFixed(2)}</p>
                                    <p>Impuesto S/.{(total * 0.18).toFixed(2)}</p>
                                    <p>Total: S/.{total.toFixed(2)}</p>
                                </div>
                                <Button type="submit" color="primary" className="mt-4">
                                    Create Order
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitClient}
                client={selectedClient}
                isViewMode={isViewMode}
            />
        </div>
    )
}