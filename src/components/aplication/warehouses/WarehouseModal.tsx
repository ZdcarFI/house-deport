'use client'

import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { WarehouseDto } from '@/services/Dto/WarehouseDto'
import { CreateWarehouseDto } from '@/services/Warehouse/dto/CreateWarehouseDto'
import { UpdateWarehouseDto } from '@/services/Warehouse/dto/UpdateWarehouseDto'
import { Select, SelectItem } from "@nextui-org/select";

interface WarehouseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: CreateWarehouseDto | UpdateWarehouseDto) => void
  warehouse: WarehouseDto | null
  isViewMode: boolean
}

export default function WarehouseModal({ isOpen, onClose, onSubmit, warehouse, isViewMode }: WarehouseModalProps) {
  const [formData, setFormData] = useState<Partial<CreateWarehouseDto & UpdateWarehouseDto>>({
    name: '',
    rowMax: 0,
    columnMax: 0,
    status: 'available', // Valor predeterminado al crear
  })

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        rowMax: warehouse.rowMax,
        columnMax: warehouse.columnMax,
        status: warehouse.status,
      })
    } else {
      setFormData({
        name: '',
        rowMax: 0,
        columnMax: 0,
        status: 'available', // Establece 'available' al crear un nuevo almacén
      })
    }
  }, [warehouse])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'rowMax' || name === 'columnMax' ? parseInt(value, 10) : value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (warehouse) {
      const updateData: UpdateWarehouseDto = {
        name: formData.name || '',
        rowMax: formData.rowMax || 0,
        columnMax: formData.columnMax || 0,
        status: formData.status || '',
      }
      onSubmit(updateData)
    } else {
      const createData: CreateWarehouseDto = {
        name: formData.name || '',
        rowMax: formData.rowMax || 0,
        columnMax: formData.columnMax || 0,
        status: formData.status || '',
      }
      onSubmit(createData)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'View Warehouse' : warehouse ? 'Edit Warehouse' : 'Add Warehouse'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              isDisabled={isViewMode}
            />
            <Input
              label="Row Max"
              name="rowMax"
              type="number"
              value={formData.rowMax?.toString()}
              onChange={handleInputChange}
              required
              isDisabled={isViewMode}
            />
            <Input
              label="Column Max"
              name="columnMax"
              type="number"
              value={formData.columnMax?.toString()}
              onChange={handleInputChange}
              required
              isDisabled={isViewMode}
            />
            <Select
              label="Status"
              name="status"
              placeholder="Select status"
              selectedKeys={formData.status ? [formData.status] : []}
              onChange={(e) => handleSelectChange(e.target.value)}
              isDisabled={isViewMode}
            >
              <SelectItem key="available" value="available">
                available
              </SelectItem>
              <SelectItem key="busy" value="busy">
                busy
              </SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {warehouse ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
