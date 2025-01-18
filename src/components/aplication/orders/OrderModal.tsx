'use client'

import React, {useState, useEffect, useContext} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/modal'
import {Button} from '@nextui-org/button'
import {Input} from '@nextui-org/input'
import {Checkbox} from '@nextui-org/checkbox'
import {Select, SelectItem} from "@nextui-org/select"
import {OrderDto} from '@/services/Dto/OrderDto'
import {CreateOrderDto, ProductBasicCreateDto} from '@/services/Order/dto/CreateOrderDto'
import {UpdateOrderDto} from '@/services/Order/dto/UpdateOrderDto'
import {ClientContext} from '@/context/ClientContext/clientContext'
import {UserContext} from '@/context/UserContext/userContext'
import {ProductContext} from '@/context/ProductContext/productContext'
import {PlusIcon, MinusIcon} from 'lucide-react'
import {initialCart as initialCart2} from "@/components/aplication/orders/CreateOrder"
import {ToastContext} from "@/context/ToastContext/ToastContext";
import {ToastType} from "@/components/Toast/Toast";


interface OrderModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (formData: CreateOrderDto | UpdateOrderDto) => void
    order: OrderDto | null
    isViewMode: boolean
}

export default function OrderModal({isOpen, onClose, onSubmit, order, isViewMode}: OrderModalProps) {
    const {clients} = React.useContext(ClientContext)!
    const {users} = React.useContext(UserContext)!
    const {products} = React.useContext(ProductContext)!
    const [formData, setFormData] = useState<CreateOrderDto & {
        numFac: string,
        status?: string,
        tax: number,
        discount: number,
        subtotal: number,
        paymentType: string,

    }>({
        numFac: '',
        clientId: 0,
        userId: 0,
        products: [],
        status: 'pending',
        tax: 0,
        discount: 0,
        subtotal: 0,
        paymentType: '',
    })
    const [calculatedSubtotal, setCalculatedSubtotal] = useState(0)
    const [useCalculatedSubtotal, setUseCalculatedSubtotal] = useState(true)
    const [total, setTotal] = useState(0)
    const [showProductForm, setShowProductForm] = useState(false)
    const [newProduct, setNewProduct] = useState(initialCart2)
    const [additionalQuantities, setAdditionalQuantities] = useState<Record<number, number>>({})

    const [warehouseSelectionProduct, setWarehouseSelectionProduct] = useState<number | null>(null)
    const {showToast} = useContext(ToastContext)!;
    useEffect(() => {
        if (order) {
            setFormData({
                numFac: order.numFac,
                clientId: order.client?.id || 0,
                userId: order.user?.id || 0,
                products: order.details?.map(detail => ({
                    id: detail.product?.id || 0,
                    quantity: detail.quantity || 0,
                    productWarehouseId: 0
                })) || [],
                status: order.status || 'pending',
                tax: order.tax || 0,
                discount: order.discount || 0,
                subtotal: order.subtotal || 0,
                paymentType: order.paymentType || ''
            })
            setUseCalculatedSubtotal(false)
        } else {
            setFormData({
                numFac: '',
                clientId: 0,
                userId: 0,
                products: [],
                status: 'pending',
                tax: 0,
                discount: 0,
                subtotal: 0,
                paymentType: '',
            })
            setUseCalculatedSubtotal(true)
        }
        setAdditionalQuantities({});  // Reset additional quantities

    }, [order])

    useEffect(() => {
        calculateTotals()
    }, [formData.products, formData.tax, formData.discount, formData.subtotal, useCalculatedSubtotal, additionalQuantities])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({...formData, [name]: value})
    }

    const handleProductChange = (index: number, field: keyof ProductBasicCreateDto, value: number) => {
        const updatedProducts = [...formData.products]
        updatedProducts[index] = {...updatedProducts[index], [field]: value}
        setFormData({...formData, products: updatedProducts})
    }


    const removeProduct = (index: number) => {
        const updatedProducts = formData.products.filter((_, i) => i !== index)
        setFormData({...formData, products: updatedProducts})
    }

    const calculateTotals = () => {
        let newSubtotal = 0
        formData.products.forEach(product => {
            const productData = products.find(p => p.id === product.id)
            if (productData) {
                const totalQuantity = product.quantity + (additionalQuantities[product.id] || 0)
                newSubtotal += productData.price * totalQuantity
            }
        })
        setCalculatedSubtotal(newSubtotal)

        const subtotalToUse = useCalculatedSubtotal ? newSubtotal : formData.subtotal

        const taxAmount = newSubtotal - subtotalToUse

        const discountAmount = formData.discount

        const newTotal = subtotalToUse + taxAmount - discountAmount

        setTotal(newTotal)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.paymentType) {
            console.error("Payment type is required")
            return
        }

        const submissionData = {
            ...formData,
            subtotal: useCalculatedSubtotal ? calculatedSubtotal : formData.subtotal,
        }
        setAdditionalQuantities({});  // Reset additional quantities

        onSubmit(submissionData)
    }

    const handleAddProduct = () => {
        if (newProduct.id && newProduct.quantity > 0) {
            const updatedProducts = [...formData.products, {
                id: newProduct.id,
                quantity: newProduct.quantity,
                productWarehouseId: newProduct.location.id
            }]
            setFormData({...formData, products: updatedProducts})
            setNewProduct(initialCart2)
            setShowProductForm(false)
        }
    }

    const handleQuantityChange = (productId: number, change: number) => {
        if (change > 0) {
            setWarehouseSelectionProduct(productId)
        } else {
            const updatedProducts = formData.products.map(product => {
                if (product.id === productId) {
                    const newQuantity = product.quantity + change
                    return newQuantity >= 0 ? {...product, quantity: newQuantity} : product
                }
                return product
            })
            setFormData({...formData, products: updatedProducts})
            setAdditionalQuantities({...additionalQuantities, [productId]: 0})
        }
    }

    const handleWarehouseSelection = (productId: number, warehouseId: number, quantity: number) => {
        const currentProduct = formData.products.find(p => p.id === productId)
        const warehouse = products.find(p => p.id === productId)?.productWarehouse?.find(w => w.id === warehouseId)

        if (currentProduct && warehouse) {
            if (quantity <= warehouse.quantity) {
                setAdditionalQuantities({...additionalQuantities, [productId]: quantity})
                const updatedProducts = formData.products.map(product => {
                    if (product.id === productId) {
                        return {
                            ...product,
                            productWarehouseId: warehouseId,
                            quantity: quantity
                        }
                    }
                    return product
                })
                setFormData({...formData, products: updatedProducts})
            } else {
                showToast(`La cantidad excede el stock disponible en este almacén (${warehouse.quantity})`, ToastType.ERROR)
            }
        }
        setWarehouseSelectionProduct(null)
    }
    const getAvailableProducts = () => {
        const selectedProductIds = formData.products.map(p => p.id);
        return products.filter(product => !selectedProductIds.includes(product.id));
    }
    return (
        <Modal isOpen={isOpen} onClose={() => {
            setAdditionalQuantities({});  // Reset additional quantities
            onClose();
        }} size="3xl" classNames={{body: "overflow-y-auto "}}>
            <ModalContent className="h-screen">
                <form onSubmit={handleSubmit}>
                    <ModalHeader className="flex flex-col gap-1">
                        {isViewMode ? 'Ver Orden' : order ? 'Editar Order' : 'Agregar Order'}
                    </ModalHeader>
                    <ModalBody className="h-[80vh]">

                        <Input
                            label="Numero de factura"
                            name="numFac"
                            value={formData.numFac}
                            onChange={handleInputChange}

                            isDisabled={isViewMode || Boolean(order)}

                        />
                        <Select
                            label="Cliente"
                            name="clientId"
                            placeholder="Selecciona un cliente"
                            selectedKeys={formData.clientId ? [formData.clientId.toString()] : []}
                            onChange={(e) => handleSelectChange('clientId')(e.target.value)}
                            isDisabled={isViewMode}
                        >
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                    {`${client.firstName}  ${client.lastName}`}
                                </SelectItem>
                            ))}
                        </Select>
                        {!isViewMode && !order && (
                            <>
                                <Select
                                    label="Usuario"
                                    name="userId"
                                    placeholder="Selecciona un usuario"
                                    selectedKeys={formData.userId ? [formData.userId.toString()] : []}
                                    onChange={(e) => handleSelectChange('userId')(e.target.value)}
                                >
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.username}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        isSelected={useCalculatedSubtotal}
                                        onValueChange={setUseCalculatedSubtotal}
                                    >
                                        Use calculated subtotal
                                    </Checkbox>
                                    <Input
                                        label="Subtotal"
                                        name="subtotal"
                                        type="number"
                                        value={useCalculatedSubtotal ? calculatedSubtotal.toFixed(2) : formData.subtotal.toString()}
                                        onChange={handleInputChange}
                                        isReadOnly={useCalculatedSubtotal}
                                    />
                                </div>
                                <Input
                                    label="Tax (%)"
                                    name="tax"
                                    type="number"
                                    value={formData.tax.toString()}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    label="Discount"
                                    name="discount"
                                    type="number"
                                    value={formData.discount.toString()}
                                    onChange={handleInputChange}
                                />
                            </>
                        )}
                        <Select
                            label="Estado"
                            name="status"
                            placeholder="Selecciona status"
                            selectedKeys={formData.status ? [formData.status] : []}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            isDisabled={isViewMode || !order}
                        >
                            <SelectItem key="pending" value="pending">Pendiente</SelectItem>
                            <SelectItem key="completed" value="completed">Completado</SelectItem>
                            <SelectItem key="canceled" value="canceled">Cancelado</SelectItem>
                        </Select>

                        <Select
                            label="Tipo de pago"
                            name="paymentType"
                            placeholder="Selecciona tipo de pago"
                            selectedKeys={formData.paymentType ? [formData.paymentType] : []}
                            onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                            isDisabled={isViewMode}
                        >
                            <SelectItem key="YAPE" value="yape">Yape</SelectItem>
                            <SelectItem key="CASH" value="cash">Efectivo</SelectItem>
                            <SelectItem key="TRANSFERS" value="transfers">Transferencias</SelectItem>
                        </Select>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Productos</h4>
                            <Button
                                color="primary"
                                startContent={<PlusIcon size={16}/>}
                                onPress={() => setShowProductForm(true)}
                            >
                                Agregar Producto
                            </Button>
                            {showProductForm && (
                                <div className="mt-4 p-4 border rounded-md">
                                    <Select
                                        label="Producto"
                                        selectedKeys={newProduct.id ? [newProduct.id.toString()] : []}
                                        onChange={(e) => {
                                            const product = products.find(p => p.id === parseInt(e.target.value))
                                            if (product) {
                                                setNewProduct({
                                                    ...newProduct,
                                                    id: product.id,
                                                    name: product.name,
                                                    price: product.price,
                                                    productWarehouses: product.productWarehouse || []
                                                })
                                            }
                                        }}
                                    >
                                        {getAvailableProducts().map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {`${p.name} - ${p.code} - S./${p.price}`}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    {newProduct.id > 0 && (
                                        <>
                                            <Select
                                                label="Almacén"
                                                className="mt-2"
                                                selectedKeys={newProduct.location.id ? [newProduct.location.id.toString()] : []}
                                                onChange={(e) => {
                                                    const warehouse = newProduct.productWarehouses.find(pw => pw.id === parseInt(e.target.value))
                                                    if (warehouse) {
                                                        setNewProduct({
                                                            ...newProduct,
                                                            location: {
                                                                id: warehouse.id,
                                                                name: warehouse.name,
                                                                row: warehouse.row,
                                                                column: warehouse.column,
                                                                color: warehouse.color,
                                                                quantity: warehouse.quantity
                                                            }
                                                        })
                                                    }
                                                }}
                                            >
                                                {newProduct.productWarehouses.map((pw) => (
                                                    <SelectItem key={pw.id} value={pw.id.toString()}>
                                                        {`${pw.name} - ${String.fromCharCode(65 + (pw.row - 1))}-${pw.column} - Max: ${pw.quantity}`}
                                                    </SelectItem>
                                                ))}
                                            </Select>

                                            <Input
                                                type="number"
                                                label="Cantidad"
                                                className="mt-2"
                                                value={newProduct.quantity.toString()}
                                                onChange={(e) => {
                                                    const quantity = parseInt(e.target.value)
                                                    if (quantity > 0 && quantity <= newProduct.location.quantity) {
                                                        setNewProduct({...newProduct, quantity})
                                                    }
                                                }}
                                            />

                                            <Button
                                                color="primary"
                                                className="mt-2"
                                                onPress={handleAddProduct}
                                            >
                                                Agregar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                            {formData.products?.map((product, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Select
                                        label="Producto"
                                        selectedKeys={product.id ? [product.id.toString()] : []}
                                        onChange={(e) => handleProductChange(index, 'id', parseInt(e.target.value))}
                                        isDisabled={isViewMode}
                                    >
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {`${p.name} - ${p.code} - S./${p.price}`}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <div className="flex flex-col">
                                        <Input
                                            label="Cantidad Actual"
                                            type="number"
                                            value={product.quantity.toString()}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                            required
                                            isReadOnly={isViewMode}
                                        />
                                        {additionalQuantities[product.id] > 0 && (
                                            <div className="text-sm text-green-600 mt-1">
                                                +{additionalQuantities[product.id]} nueva cantidad
                                            </div>
                                        )}
                                    </div>
                                    {!isViewMode && (
                                        <>
                                            <Button color="primary"
                                                    onClick={() => handleQuantityChange(product.id, -1)}>
                                                <MinusIcon size={16}/>
                                            </Button>
                                            <Button color="primary" onClick={() => handleQuantityChange(product.id, 1)}>
                                                <PlusIcon size={16}/>
                                            </Button>
                                            <Button color="danger" onClick={() => removeProduct(index)}>
                                                Quitar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {warehouseSelectionProduct && (
                            <div className="mt-4 p-4 border rounded-md">
                                <h5 className="text-lg font-semibold mb-2">Seleccionar Almacén</h5>
                                <p className="text-sm text-gray-600 mb-2">
                                    Cantidad adicional: {additionalQuantities[warehouseSelectionProduct] || 0}
                                </p>
                                {products.find(p => p.id === warehouseSelectionProduct)?.productWarehouse?.map(warehouse => (
                                    <div key={warehouse.id} className="flex items-center justify-between mb-2">
                                        <span>{`${warehouse.name} - ${String.fromCharCode(65 + (warehouse.row - 1))}-${warehouse.column} - Disponible: ${warehouse.quantity}`}</span>
                                        <Input
                                            type="number"
                                            placeholder="Cantidad"
                                            className="w-24 mr-2"
                                            min={1}
                                            max={warehouse.quantity}
                                            onChange={(e) => {
                                                const quantity = parseInt(e.target.value)
                                                if (!isNaN(quantity)) {
                                                    handleWarehouseSelection(warehouseSelectionProduct, warehouse.id, quantity)
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4">
                            <p>Total: S/.{total.toFixed(2)}</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        {!isViewMode && (
                            <Button color="primary" type="submit">
                                {order ? 'Update' : 'Create'}
                            </Button>
                        )}
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

