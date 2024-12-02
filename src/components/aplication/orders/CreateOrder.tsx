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
import {CreateOrderDto} from '@/services/Order/dto/CreateOrderDto';
import {OrderContext} from '@/context/OrderContext/orderContext';
import {Minus, Plus} from 'lucide-react';
import {CirclePlus} from "@/components/icons/CirclePlus";
import ClientModal from "@/components/aplication/clients/ClientModal";
import {CheckIcon} from "@/components/icons/CheckIcon";
import {ToastContext} from "@/context/ToastContext/ToastContext";
import {ToastType} from "@/components/Toast/Toast";
import {DataCartDto} from "@/components/aplication/orders/dto/DataCartDto";
import {AuthContext} from "@/context/AuthContext/authContext";
import OrderSkeletonPage from "@/components/skeletons/OrderSkeleton";


const initialCart: DataCartDto = {
    id: 0,
    name: '',
    price: 0,
    size: {
        id: 0,
        name: ''
    },
    category: {
        id: 0,
        name: ''
    },
    location: {
        id: 0,
        name: '',
        row: 0,
        column: 0,
        color: '',
        quantity: 0
    },
    productWarehouses: [],
    quantity: 0
}

export default function CreateOrderPage() {
    const {products, loading} = React.useContext(ProductContext)!
    const {user} = React.useContext(AuthContext)!
    const {
        showToast
    } = React.useContext(ToastContext)!
    const {
        clients,
        openModal
    } = React.useContext(ClientContext)!
    const {createOrder, errorOrder} = React.useContext(OrderContext)!

    const [dataCart, setDataCart] = useState<DataCartDto[]>([]);
    const [newCart, setNewCart] = useState<DataCartDto>(initialCart);
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

    useEffect(() => {
        console.log(user);
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [dataCart]);

    const [total, setTotal] = useState(0);

    const handleQuantityChange = (id: number, change: number) => {
        const product = dataCart.find(p => p.id === id);
        if (product) {
            setDataCart(
                dataCart.map(item => {
                    if (item.id === id) {
                        const newQuantity = Math.max(1, Math.min(item.quantity + change, product.location.quantity))
                        return {...item, quantity: newQuantity}
                    }
                    return item
                })
            )
        }
    }

    const removeFromCart = (id: number) => {
        setDataCart(dataCart.filter(item => item.id !== id))
    }

    const calculateTotals = () => {
        const newSubtotal = dataCart.reduce((sum, item) => {
            return sum + (item ? item.price * item.quantity : 0)
        }, 0)

        setTotal(newSubtotal)
        setOrderData(prev => ({
            ...prev, subtotal: newSubtotal, products: dataCart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                productWarehouseId: item.location.id
            }))
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(user);
        console.log(orderData);
        if (orderData.numFac === '') {
            showToast("Debe ingresar un número de factura", ToastType.WARNING);
        } else if (orderData.clientId === 0) {
            showToast("Debe seleccionar un cliente", ToastType.WARNING);
        } else if (orderData.paymentType === '') {

            showToast("Debe seleccionar un tipo de pago", ToastType.WARNING);
        } else if (!orderData.products) {
            showToast("Debe agregar productos", ToastType.WARNING);
        } else if (orderData.userId === 0) {
            showToast("Usuario no existe", ToastType.ERROR);
        } else {
            await createOrder(orderData)
            showToast(errorOrder, ToastType.ERROR);
        }

    }

    const handleSelectChange = (name: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderData(prev => ({...prev, [name]: Number(e.target.value)}))
    }

    const handleAdd = () => {
        openModal(null, false);
    };

    const onSelectionChangeProduct = (id: React.Key | null) => {
        if (id) {
            const product = products.find(p => p.id === Number(id));
            if (product) {
                setNewCart({
                    ...newCart, id: product.id,
                    name: product.name,
                    price: product.price,
                    size: product.size,
                    category: product.category,
                    productWarehouses: product.productWarehouse
                });
            }
        }
    };

    const addProductToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (validateAddProductToCart()) {
            const existingDataCart = dataCart.find(item => item.id === newCart.id)
            if (existingDataCart) {
                setDataCart(dataCart.map(item =>
                    item.id === newCart.id ? {...item, quantity: item.quantity + newCart.quantity} : item
                ));
            } else {
                setDataCart([
                    ...dataCart,
                    {
                        id: newCart.id,
                        name: newCart.name,
                        price: newCart.price,
                        size: newCart.size,
                        category: newCart.category,
                        location: newCart.location,
                        productWarehouses: newCart.productWarehouses,
                        quantity: newCart.quantity
                    }
                ])
            }

            setNewCart(initialCart);
        }
    }

    function validateAddProductToCart(): boolean {
        if (newCart.id === 0) {
            showToast("Debe seleccionar un producto", ToastType.WARNING);
            return false;
        } else if (newCart.location.id == 0) {
            showToast("Debe seleccionar la ubicación", ToastType.WARNING);
            return false;
        }
        return true;
    }

    if(loading){
        return (
            <OrderSkeletonPage/>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Nueva Orden</h1>
            <div>
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
                                            <SelectItem key="YAPE" value="yape">Yape</SelectItem>
                                            <SelectItem key="CASH" value="cash">Efectivo</SelectItem>
                                            <SelectItem key="TRANSFERS" value="transfers">Transferencias</SelectItem>
                                        </Select>
                                    </div>
                                </div>
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
                                                            inputValue={newCart.name}
                                                            onInputChange={(value) => setNewCart({
                                                                ...newCart,
                                                                name: value
                                                            })}
                                                        >
                                                            {products.map((product) => (
                                                                <AutocompleteItem key={product.id} value={product.id}>
                                                                    {product.name}
                                                                </AutocompleteItem>
                                                            ))}
                                                        </Autocomplete>
                                                    </TableCell>
                                                    <TableCell>{newCart.price === 0 ? '' : newCart.price}</TableCell>
                                                    <TableCell>{newCart.size.name}</TableCell>
                                                    <TableCell>{newCart.category.name}</TableCell>
                                                    <TableCell
                                                        className="min-w-60">
                                                        <Select
                                                            value={newCart?.location.id.toString()}
                                                            onChange={(e) => {
                                                                const productWarehouse = newCart.productWarehouses.find((productWarehouse) => productWarehouse.id === parseInt(e.target.value));
                                                                if (productWarehouse) {
                                                                    setNewCart({
                                                                        ...newCart,
                                                                        location: {
                                                                            id: productWarehouse.id,
                                                                            row: productWarehouse.row,
                                                                            column: productWarehouse.column,
                                                                            color: productWarehouse.color,
                                                                            quantity: productWarehouse.quantity,
                                                                            name: productWarehouse.name
                                                                        }
                                                                    })
                                                                }
                                                            }}
                                                            aria-label="Select a product location"
                                                            isDisabled={newCart.id === 0}
                                                        >
                                                            {newCart.productWarehouses.map((productWarehouse) => (
                                                                <SelectItem
                                                                    key={productWarehouse.id}
                                                                    value={productWarehouse.id.toString()}
                                                                    textValue={`${productWarehouse.row}-${productWarehouse.column}`}
                                                                    style={{
                                                                        backgroundColor: productWarehouse.color,
                                                                    }}
                                                                >
                                                                    {productWarehouse.name}{" "}{productWarehouse.row}-{productWarehouse.column}
                                                                </SelectItem>
                                                            ))}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={newCart.quantity.toString()}
                                                            onChange={
                                                                (e) => {
                                                                    if (newCart.location.quantity > 0 && parseInt(e.target.value) <= newCart.location.quantity) {
                                                                        setNewCart({
                                                                            ...newCart,
                                                                            quantity: parseInt(e.target.value)
                                                                        })
                                                                    } else {
                                                                        showToast(`No hay suficiente stock en la ubicación seleccionada, max(${newCart.location.quantity})`, ToastType.WARNING);
                                                                    }
                                                                }
                                                            }
                                                            type={"number"}
                                                            className="mb-2"
                                                            isDisabled={newCart.location.id === 0}
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
                                                            isDisabled={newCart.id === 0}>
                                                            <CheckIcon color="white"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>,
                                                ...dataCart.map(dataCart => {
                                                    return (
                                                        <TableRow key={dataCart.id}>
                                                            <TableCell>{dataCart.name}</TableCell>
                                                            <TableCell>{dataCart.price}</TableCell>
                                                            <TableCell>{dataCart.size.name}</TableCell>
                                                            <TableCell>{dataCart.category.name}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    className="w-full"
                                                                    style={{
                                                                        backgroundColor: dataCart.location.color,
                                                                    }}
                                                                >
                                                                    {dataCart.location.name}{" "}{dataCart.location.row}-{dataCart.location.column}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <Button
                                                                        size="sm"
                                                                        isIconOnly
                                                                        onClick={() => handleQuantityChange(dataCart.id, -1)}
                                                                    >
                                                                        <Minus size={16}/>
                                                                    </Button>
                                                                    <span className="mx-2">{dataCart.quantity}</span>
                                                                    <Button
                                                                        size="sm"
                                                                        isIconOnly
                                                                        onClick={() => handleQuantityChange(dataCart.id, 1)}
                                                                    >
                                                                        <Plus size={16}/>
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    size="sm"
                                                                    color="danger"
                                                                    onClick={() => removeFromCart(dataCart.id)}
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
                showToast={showToast}/>
        </div>
    )
}