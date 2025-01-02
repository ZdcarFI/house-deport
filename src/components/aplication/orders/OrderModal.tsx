'use client'

import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Checkbox } from '@nextui-org/checkbox'
import { OrderDto } from '@/services/Dto/OrderDto'
import { CreateOrderDto, ProductBasicCreateDto } from '@/services/Order/dto/CreateOrderDto'
import { UpdateOrderDto } from '@/services/Order/dto/UpdateOrderDto'
import { Select, SelectItem } from "@nextui-org/select"
import { ClientContext } from '@/context/ClientContext/clientContext'
import { UserContext } from '@/context/UserContext/userContext'
import { ProductContext } from '@/context/ProductContext/productContext'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: CreateOrderDto | UpdateOrderDto) => void
  order: OrderDto | null
  isViewMode: boolean
}

export default function OrderModal({ isOpen, onClose, onSubmit, order, isViewMode }: OrderModalProps) {
  const { clients } = React.useContext(ClientContext)!
  const { users } = React.useContext(UserContext)!
  const { products } = React.useContext(ProductContext)!
  const [formData, setFormData] = useState<CreateOrderDto & { numFac: string, status?: string, tax: number, discount: number, subtotal: number }>({
    numFac: '',
    clientId: 0,
    userId: 0,
    products: [],
    status: 'pending',
    tax: 0,
    discount: 0,
    subtotal: 0,
  })
  const [calculatedSubtotal, setCalculatedSubtotal] = useState(0)
  const [useCalculatedSubtotal, setUseCalculatedSubtotal] = useState(true)
  const [total, setTotal] = useState(0)

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
      })
      setUseCalculatedSubtotal(true)
    }
  }, [order])

  useEffect(() => {
    calculateTotals()
  }, [formData.products, formData.tax, formData.discount, formData.subtotal, useCalculatedSubtotal])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: parseInt(value) })
  }

  const handleProductChange = (index: number, field: keyof ProductBasicCreateDto, value: number) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setFormData({ ...formData, products: updatedProducts })
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { id: 0, quantity: 1, productWarehouseId: 0 }],
    })
  }

  const removeProduct = (index: number) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index)
    setFormData({ ...formData, products: updatedProducts })
  }

  const calculateTotals = () => {
    let newSubtotal = 0
    formData.products.forEach(product => {
      const productData = products.find(p => p.id === product.id)
      if (productData) {
        newSubtotal += productData.price * product.quantity
      }
    })
    setCalculatedSubtotal(newSubtotal)

    const subtotalToUse = useCalculatedSubtotal ? newSubtotal : formData.subtotal
    const taxAmount = subtotalToUse * (formData.tax / 100)
    const discountAmount = formData.discount
    const newTotal = subtotalToUse + taxAmount - discountAmount

    setTotal(newTotal)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      subtotal: useCalculatedSubtotal ? calculatedSubtotal : formData.subtotal,
    }
    onSubmit(submissionData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'Ver Orden' : order ? 'Editar Order' : 'Agregar Order'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Invoice Number"
              name="numFac"
              value={formData.numFac}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Select
              label="Client"
              name="clientId"
              placeholder="Select a client"
              selectedKeys={formData.clientId ? [formData.clientId.toString()] : []}
              onChange={(e) => handleSelectChange('clientId')(e.target.value)}
              isDisabled={isViewMode}
            >
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.firstName} {client.lastName}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="User"
              name="userId"
              placeholder="Select a user"
              selectedKeys={formData.userId ? [formData.userId.toString()] : []}
              onChange={(e) => handleSelectChange('userId')(e.target.value)}
              isDisabled={isViewMode}
            >
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.username}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Status"
              name="status"
              placeholder="Select status"
              selectedKeys={formData.status ? [formData.status] : []}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              isDisabled={isViewMode || !order}
            >
              <SelectItem key="pending" value="pending">Pending</SelectItem>
              <SelectItem key="completed" value="completed">Completed</SelectItem>
              <SelectItem key="canceled" value="canceled">Canceled</SelectItem>
            </Select>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Products</h4>
              {formData.products?.map((product, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select
                    label="Product"
                    selectedKeys={product.id ? [product.id.toString()] : []}
                    onChange={(e) => handleProductChange(index, 'id', parseInt(e.target.value))}
                    isDisabled={isViewMode}
                  >
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Quantity"
                    type="number"
                    value={product.quantity.toString()}
                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                    required
                    isReadOnly={isViewMode}
                  />
                  {!isViewMode && (
                    <Button color="danger" onClick={() => removeProduct(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {!isViewMode && (
                <Button onClick={addProduct}>Add Product</Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                isSelected={useCalculatedSubtotal}
                onValueChange={setUseCalculatedSubtotal}
                isDisabled={isViewMode}
              >
                Use calculated subtotal
              </Checkbox>
              <Input
                label="Subtotal"
                name="subtotal"
                type="number"
                value={useCalculatedSubtotal ? calculatedSubtotal.toFixed(2) : formData.subtotal.toString()}
                onChange={handleInputChange}
                isReadOnly={useCalculatedSubtotal || isViewMode}
              />
            </div>
            <Input
              label="Tax (%)"
              name="tax"
              type="number"
              value={formData.tax.toString()}
              onChange={handleInputChange}
              isReadOnly={isViewMode}
            />
            <Input
              label="Discount"
              name="discount"
              type="number"
              value={formData.discount.toString()}
              onChange={handleInputChange}
              isReadOnly={isViewMode}
            />
            <div className="mt-4">
              <p>Total: ${total.toFixed(2)}</p>
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