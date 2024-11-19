'use client'

import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { ClientDto } from '@/services/Dto/ClienDto'
import {Select, SelectItem} from "@nextui-org/select";

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: ClientDto) => void
  client: ClientDto | null
  isViewMode: boolean
}

export default function ClientModal({ isOpen, onClose, onSubmit, client, isViewMode }: ClientModalProps) {
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
    if (client) {
      setFormData(client)
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
  }, [client])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'View Client' : client ? 'Edit Client' : 'Add Client'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nombres"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Apellidos"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Correo"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Celular"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            {
              <Select
                  label="Tipo de Documento"
                  name="typeDocument"
                  placeholder="Seleccione un tipo de documento"
                  onChange={(e) => handleSelectChange('typeDocument')(e.target.value)}
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
              name="numberDocument"
              value={formData.numberDocument}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />

          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {client ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}