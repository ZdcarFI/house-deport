'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { UserDto } from '@/services/Dto/UserDto'
import { CreateUserDto } from '@/services/User/dto/CreateUserDto'
import { UpdateUserDto } from '@/services/User/dto/UpdateUserDto'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: CreateUserDto | UpdateUserDto) => void
  user: UserDto | null
  isViewMode: boolean
}

export default function UserModal({ isOpen, onClose, onSubmit, user, isViewMode }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<CreateUserDto & UpdateUserDto>>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const updateData: UpdateUserDto = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        password: formData.password || '',
      }
      onSubmit(updateData)
    } else {
      const createData: CreateUserDto = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        username: formData.username || '',
        email: formData.email || '',
        password: formData.password || '',
      }
      onSubmit(createData)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'View User' : user ? 'Edit User' : 'Add User'}
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
            {(!user || isViewMode) && (
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                isReadOnly={isViewMode}
              />
            )}
            {(!user || isViewMode) && (
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                isReadOnly={isViewMode}
              />
            )}
            {!isViewMode && (
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!user}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {user ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}