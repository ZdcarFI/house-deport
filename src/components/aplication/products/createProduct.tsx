'use client'

import React, { useState, useContext, useEffect } from 'react'
import { Button, Input, Select, SelectItem, Card, CardBody, CardHeader } from "@nextui-org/react"
import { useRouter } from 'next/navigation'
import { ProductContext } from '@/context/ProductContext/productContext'
import { CategoryContext } from "@/context/CategoryContext/categoryContext"
import { SizeContext } from "@/context/SizeContext/sizeContext"

import { CreateProductDto, LocationDto } from "@/services/Product/dto/CreateProductDto"

import { PlusIcon, MinusIcon, HomeIcon as HouseIcon, BoxIcon } from 'lucide-react'
import Link from 'next/link'
import { WarehouseContext } from '@/context/WareHouseContext/warehouseContext'

export default function AddProductPage() {
  const router = useRouter()
  const { createProduct } = useContext(ProductContext)!
  const { categories } = useContext(CategoryContext)!
  const { sizes } = useContext(SizeContext)!
  const { warehouses } = useContext(WarehouseContext)!

  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    code: '',
    price: 0,
    categoryId: 0,
    sizeId: 0,
    location: [],
    stockInventory: 0
  })

  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [row, setRow] = useState<number | null>(null)
  const [column, setColumn] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number>(0)

  const [availableSizes, setAvailableSizes] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    if (formData.categoryId) {
      const category = categories.find(c => c.id === formData.categoryId)
      setAvailableSizes(category?.sizes || [])
    } else {
      setAvailableSizes([])
    }
  }, [formData.categoryId, categories])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }))
  }

  const handleSelectChange = (name: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [name]: Number(e.target.value) }))
  }

  const addLocation = () => {
    if (selectedWarehouse && row && column && quantity) {
      const newLocation: LocationDto = {
        warehouseId: selectedWarehouse,
        row,
        column,
        quantity
      }
      setFormData(prev => ({
        ...prev,
        location: [...prev.location, newLocation],
        stockInventory: prev.stockInventory + quantity
      }))
   
      setSelectedWarehouse(null)
      setRow(null)
      setColumn(null)
      setQuantity(0)
    }
  }

  const removeLocation = (index: number) => {
    setFormData(prev => {
      const newLocations = [...prev.location]
      const removedQuantity = newLocations[index].quantity
      newLocations.splice(index, 1)
      return {
        ...prev,
        location: newLocations,
        stockInventory: prev.stockInventory - removedQuantity
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProduct(formData)
      router.push('/products')
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href="/">
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <BoxIcon />
          <Link href="/products">
            <span>Products</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>Add Product</span>
        </li>
      </ul>

      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Product Details</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Product Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={formData.price.toString()}
              onChange={handleInputChange}
              required
            />
            <Select
              label="Category"
              onChange={handleSelectChange('categoryId')}
              value={formData.categoryId.toString()}
            >
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Size"
              onChange={handleSelectChange('sizeId')}
              value={formData.sizeId.toString()}
              isDisabled={!formData.categoryId}
            >
              {availableSizes.map((size) => (
                <SelectItem key={size.id} value={size.id.toString()}>
                  {size.name}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Product Location</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Warehouse"
              onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
              value={selectedWarehouse?.toString() || ''}
            >
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Row"
              type="number"
              value={row?.toString() || ''}
              onChange={(e) => setRow(Number(e.target.value))}
            />
            <Input
              label="Column"
              type="number"
              value={column?.toString() || ''}
              onChange={(e) => setColumn(Number(e.target.value))}
            />
            <Input
              label="Quantity"
              type="number"
              value={quantity.toString()}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button color="primary" onClick={addLocation}>
              Add Location
            </Button>
            <div>
              <h3 className="font-bold mb-2">Added Locations:</h3>
              {formData.location.map((loc, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <span>
                    Warehouse: {warehouses.find(w => w.id === loc.warehouseId)?.name},
                    Row: {loc.row}, Column: {loc.column}, Quantity: {loc.quantity}
                  </span>
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onClick={() => removeLocation(index)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Inventory Summary</h2>
          </CardHeader>
          <CardBody>
            <p>Total Stock Inventory: {formData.stockInventory}</p>
          </CardBody>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button color="danger" variant="light" onClick={() => router.push('/products')}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  )
}