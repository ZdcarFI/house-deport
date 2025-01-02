'use client'

import React, { useState, useEffect, useContext } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from "@nextui-org/select"
import { CreateWarehouseDto } from '@/services/Warehouse/dto/CreateWarehouseDto'
import { UpdateWarehouseDto } from '@/services/Warehouse/dto/UpdateWarehouseDto'
import { ToastType } from '@/components/Toast/Toast'
import { WarehouseContext } from '@/context/WareHouseContext/warehouseContext'
import { warehouseColors } from '@/utils/colors'

interface Props {
  showToast: (message: string, type: ToastType) => void;
}

export default function WarehouseModal({ showToast }: Props) {
  const { isModalOpen, closeModal, selectedWarehouse, isViewMode, createWarehouse, updateWarehouse } = useContext(WarehouseContext)!;
  
  const [formData, setFormData] = useState<Partial<CreateWarehouseDto & UpdateWarehouseDto>>({
    name: "",
    rowMax: 0,
    columnMax: 0,
    description: "",
    color: "",
  })

  useEffect(() => {
    if (selectedWarehouse) {
      setFormData({
        name: selectedWarehouse.name || '',
        rowMax: selectedWarehouse.rowMax || 0,
        columnMax: selectedWarehouse.columnMax || 0,
        description: selectedWarehouse.description || '',
        color: selectedWarehouse.color || '',
      })
    } else {
      setFormData({
        name: '',
        rowMax: 0,
        columnMax: 0,
        description: '',
        color: '',
      })
    }
  }, [selectedWarehouse])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rowMax' || name === 'columnMax' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedWarehouse) {
        await updateWarehouse(selectedWarehouse.id, formData as UpdateWarehouseDto);
        showToast("Almacén actualizado exitosamente", ToastType.SUCCESS);
      } else {
        await createWarehouse(formData as CreateWarehouseDto);
        showToast("Almacén creado exitosamente", ToastType.SUCCESS);
      }
      closeModal();
    } catch (error) {
      showToast("Error al enviar los datos del almacén:" + error, ToastType.ERROR)
    }
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      classNames={{
        base: "max-w-xl",
        header: "border-b border-gray-200 dark:border-gray-700",
        footer: "border-t border-gray-200 dark:border-gray-700",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'Ver Almacén' : selectedWarehouse ? 'Editar Almacén' : 'Agregar Almacén'}
          </ModalHeader>
          <ModalBody>
            <Input
              name="name"
              label="Nombre"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Escriba el nombre del almacén"
              isRequired={!isViewMode}
              isDisabled={isViewMode}
              classNames={{
                label: "font-semibold",
              }}
            />
            <Input
              name="rowMax"
              label="Filas máximas"
              type="number"
              value={formData.rowMax?.toString()}
              onChange={handleInputChange}
              placeholder="Escriba la cantidad de filas máximas"
              isRequired={!isViewMode}
              isDisabled={isViewMode}
              classNames={{
                label: "font-semibold",
              }}
            />
            <Input
              name="columnMax"
              label="Columnas Máximas"
              type="number"
              value={formData.columnMax?.toString()}
              onChange={handleInputChange}
              placeholder="Escriba la cantidad de columnas máximas"
              isRequired={!isViewMode}
              isDisabled={isViewMode}
              classNames={{
                label: "font-semibold",
              }}
            />
            <Input
              name="description"
              label="Descripción"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Escriba la descripción del almacén"
              isRequired={!isViewMode}
              isDisabled={isViewMode}
              classNames={{
                label: "font-semibold",
              }}
            />

            <Select
              label="Color"
              selectedKeys={formData.color ? [formData.color] : []}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              placeholder="Seleccione un color"
              isRequired={!isViewMode}
              isDisabled={isViewMode}
            >
              {warehouseColors.map((color) => (
                <SelectItem
                  key={color.value}
                  value={color.value}
                  textValue={color.label}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Cerrar
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {selectedWarehouse ? 'Actualizar' : 'Crear'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}