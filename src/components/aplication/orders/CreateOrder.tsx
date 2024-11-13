'use client'

import React, { useState, useEffect } from 'react'
import { Input, Select, SelectItem, Button, Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { ProductContext } from '@/context/ProductContext/productContext'
import { ClientContext } from '@/context/ClientContext/clientContext'
import { CategoryContext } from '@/context/CategoryContext/categoryContext'
import { SizeContext } from '@/context/SizeContext/sizeContext'
import { CreateOrderDto, ProductBasicCreateDto } from '@/services/Order/dto/CreateOrderDto'
import { OrderContext } from '@/context/OrderContext/orderContext'
import { Plus, Minus } from 'lucide-react'

export default function CreateOrderPage() {
    const { products, getProducts, updateProductStock } = React.useContext(ProductContext)!
    const { clients } = React.useContext(ClientContext)!
    const { categories } = React.useContext(CategoryContext)!
    const { sizes } = React.useContext(SizeContext)!
    const { createOrder } = React.useContext(OrderContext)!

    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [cart, setCart] = useState<ProductBasicCreateDto[]>([])
    const [orderData, setOrderData] = useState<CreateOrderDto & { status: string, tax: number, discount: number, subtotal: number, paymentType: string }>({
        numFac: '',
        clientId: 0,
        userId: 0, // Assuming the logged-in user's ID
        products: [],
        status: 'pending',
        tax: 0,
        discount: 0,
        subtotal: 0,
        paymentType: '',
    })
    const [subtotal, setSubtotal] = useState(0)
    const [total, setTotal] = useState(0)
    const [enableTax, setEnableTax] = useState(false)
    const [enableDiscount, setEnableDiscount] = useState(false)

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        const filtered = products.filter(product =>
            (selectedCategory === '' || product.category.id.toString() === selectedCategory) &&
            (selectedSize === '' || product.size.id.toString() === selectedSize) &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredProducts(filtered)
    }, [selectedCategory, selectedSize, searchQuery, products])

    useEffect(() => {
        calculateTotals()
    }, [cart, orderData.tax, orderData.discount])

    const handleProductDoubleClick = (product: any) => {
        const existingProduct = cart.find(item => item.id === product.id)
        if (existingProduct) {
            if (existingProduct.quantity < product.stockStore) {
                setCart(cart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                ))
            }
        } else {
            setCart([...cart, { id: product.id, quantity: 1 }])
        }
    }

    const handleQuantityChange = (id: number, change: number) => {
        const product = products.find(p => p.id === id)
        if (product) {
            setCart(cart.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, Math.min(item.quantity + change, product.stockStore))
                    return { ...item, quantity: newQuantity }
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
        setSubtotal(newSubtotal)

        const taxAmount = enableTax ? newSubtotal * (orderData.tax / 100) : 0
        const discountAmount = enableDiscount ? orderData.discount : 0
        const newTotal = newSubtotal + taxAmount - discountAmount

        setTotal(newTotal)
        setOrderData(prev => ({ ...prev, subtotal: newSubtotal, products: cart }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createOrder(orderData)
            // Handle successful order creation (e.g., show success message, redirect)
        } catch (error) {
            console.error("Error creating order:", error)
            // Handle error (e.g., show error message)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Order</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                                    <SelectItem key="all" value="">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Size"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <SelectItem key="all" value="">All Sizes</SelectItem>
                                    {sizes.map((size) => (
                                        <SelectItem key={size.id} value={size.id.toString()}>
                                            {size.name}
                                        </SelectItem>
                                    ))}
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
                                        onDoubleClick={() => handleProductDoubleClick(product)}
                                    >
                                        <p>{product.name}</p>
                                        <p className="text-sm text-gray-600">Stock: {product.stockStore}</p>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Order Details</h2>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Invoice Number"
                                    value={orderData.numFac}
                                    onChange={(e) => setOrderData({ ...orderData, numFac: e.target.value })}
                                    className="mb-2"
                                />
                                <Select
                                    label="Client"
                                    value={orderData.clientId.toString()}
                                    onChange={(e) => setOrderData({ ...orderData, clientId: parseInt(e.target.value) })}
                                    className="mb-2"
                                >
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            {client.firstName} {client.lastName}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Payment Type"
                                    value={orderData.paymentType}
                                    onChange={(e) => setOrderData({ ...orderData, paymentType: e.target.value })}
                                    className="mb-2"
                                >
                                    <SelectItem key="cash" value="cash">Cash</SelectItem>
                                    <SelectItem key="credit" value="credit">Credit Card</SelectItem>
                                    <SelectItem key="transfer" value="transfer">Bank Transfer</SelectItem>
                                </Select>
                                <div className="flex items-center gap-2 mb-2">
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
                                            onChange={(e) => setOrderData({ ...orderData, tax: parseFloat(e.target.value) })}
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
                                            onChange={(e) => setOrderData({ ...orderData, discount: parseFloat(e.target.value) })}
                                        />
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-semibold">Cart</h3>
                                    <Table aria-label="Cart items">
                                        <TableHeader>
                                            <TableColumn>Product</TableColumn>
                                            <TableColumn>Size</TableColumn>
                                            <TableColumn>Category</TableColumn>
                                            <TableColumn>Quantity</TableColumn>
                                            <TableColumn>Action</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {cart.map((item) => {
                                                const product = products.find(p => p.id === item.id)
                                                return product ? (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>{product.size.name}</TableCell>
                                                        <TableCell>{product.category.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center">
                                                                <Button size="sm" isIconOnly onClick={() => handleQuantityChange(item.id, -1)}>
                                                                    <Minus size={16} />
                                                                </Button>
                                                                <span className="mx-2">{item.quantity}</span>
                                                                <Button size="sm" isIconOnly onClick={() => handleQuantityChange(item.id, 1)}>
                                                                    <Plus size={16} />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button size="sm" color="danger" onClick={() => removeFromCart(item.id)}>
                                                                Remove
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : null
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4">
                                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                                    <p>Total: ${total.toFixed(2)}</p>
                                </div>
                                <Button type="submit" color="primary" className="mt-4">
                                    Create Order
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}