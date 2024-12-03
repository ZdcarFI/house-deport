'use client'

import React, { useState, useEffect, useContext } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { ClientDto } from '@/services/Dto/ClienDto'
import { Select, SelectItem } from "@nextui-org/select";
import { ToastType } from '@/components/Toast/Toast'
import { ClientContext } from '@/context/ClientContext/clientContext'
import { UpdateClientDto } from '@/services/Client/dto/UpdateClientDto'
import { CreateClientDto } from '@/services/Client/dto/CreateClientDto'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: ClientDto) => void
  client: ClientDto | null
  isViewMode: boolean
}
interface Props {
  showToast: (message: string, type: ToastType) => void;
}


export default function ClientModal({ showToast }: Props) {
  const { isModalOpen, closeModal, selectedClient, isViewMode, createClient, updateClient } = useContext(ClientContext)!;
  const [formData, setFormData] = useState<ClientDto>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    numberDocument: '',
    typeDocument: '',
    createdAt: ""
  });

  useEffect(() => {
    if (selectedClient) {
      setFormData(selectedClient)
    } else {
      setFormData({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        numberDocument: '',
        typeDocument: '',
        createdAt: ""
      })
    }
  }, [selectedClient])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id, formData as UpdateClientDto);
        showToast("Cliente actualizada exitosamente", ToastType.SUCCESS);
      } else {
        await createClient(formData as CreateClientDto);
        showToast("Cliente creada exitosamente", ToastType.SUCCESS);
      }
      closeModal();
    } catch (error) {
      showToast("Error al enviar los datos del Cliente:" + error, ToastType.ERROR)
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
            <h2 className="text-xl font-bold">
              {isViewMode ? 'Ver Cliente' : selectedClient ? 'Editar Cliente' : 'Agregar Cliente'}
            </h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombres"
                labelPlacement="outside"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Escriba los nombres"
                isRequired={!isViewMode}
                isDisabled={isViewMode}
                classNames={{
                  label: "font-semibold",
                }}
              />
              <Input
                label="Apellidos"
                labelPlacement="outside"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Escriba los apellidos"
                isRequired={!isViewMode}
                isDisabled={isViewMode}
                classNames={{
                  label: "font-semibold",
                }}
              />
              <Input
                label="Correo"
                labelPlacement="outside"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Escriba el correo electronico"
                isRequired={!isViewMode}
                isDisabled={isViewMode}
                className="col-span-2"
                classNames={{
                  label: "font-semibold",
                }}
              />
              <Input
                label="Celular"
                labelPlacement="outside"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Escriba el correo electronico"
                isRequired={!isViewMode}
                isDisabled={isViewMode}

                classNames={{
                  label: "font-semibold",
                }}
              />
              <Input
                label="Dirección"
                labelPlacement="outside"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Escriba la direccion"
                isRequired={!isViewMode}
                isDisabled={isViewMode}

                classNames={{
                  label: "font-semibold",
                }}
              />
              {
                <Select
                  label="Tipo de Documento"
                  labelPlacement="outside"
                  name="typeDocument"
                  placeholder="Seleccione un tipo de documento"
                  selectedKeys={formData.typeDocument ? [formData.typeDocument] : []}
                  onChange={(e) => handleSelectChange('typeDocument')(e.target.value)}
                  isRequired={!isViewMode}
                  isDisabled={isViewMode}
                  classNames={{
                    label: "font-semibold",
                  }}
                >
                  <SelectItem key="DNI" value="DNI">
                    DNI
                  </SelectItem>
                  <SelectItem key="RUC" value="RUC">
                    RUC
                  </SelectItem>
                </Select>
              }
              <Input
                label="Número de Documento"
                labelPlacement="outside"
                name="numberDocument"
                value={formData.numberDocument}
                onChange={handleInputChange}
                placeholder="Escribe el numero del documento"
                isRequired={!isViewMode}
                isDisabled={isViewMode}
                classNames={{
                  label: "font-semibold",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {selectedClient ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}