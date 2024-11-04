'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { ClientDto } from '@/services/Dto/ClienDto'

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
  })

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
      })
    }
  }, [client])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Document Number"
              name="numberDocument"
              value={formData.numberDocument}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            <Input
              label="Document Type"
              name="typeDocument"
              value={formData.typeDocument}
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