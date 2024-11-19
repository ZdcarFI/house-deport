'use client'

import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from "@nextui-org/select"
import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon'
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon'
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
  const [formData, setFormData] = useState<Partial<CreateUserDto & UpdateUserDto & { confirmPassword: string }>>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        gender: user.gender,
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, gender: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const updateData: UpdateUserDto = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        password: formData.password || '',
        gender: formData.gender || '',
      }
      onSubmit(updateData)
    } else {
      const createData: CreateUserDto = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        username: formData.username || '',
        email: formData.email || '',
        password: formData.password || '',
        gender: formData.gender || ''
      }
      onSubmit(createData)
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
              {isViewMode ? 'Ver usuario' : user ? 'Editar usuario' : 'Agregar Usuario'}
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
                label="Nombre de usuario"
                labelPlacement="outside"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Escriba el nombre de usuario"
                isRequired={!isViewMode}
                isDisabled={isViewMode}
                classNames={{
                  label: "font-semibold",
                }}
              />

              <Select
                label="Genero"
                labelPlacement="outside"
                placeholder="Escoja un genero"
                selectedKeys={formData.gender ? [formData.gender] : []}
                onChange={(e) => handleSelectChange(e.target.value)}
                isRequired={!isViewMode}
                isDisabled={isViewMode}
                classNames={{
                  label: "font-semibold",
                }}
              >
                <SelectItem key="MALE" value="MALE">Masculino</SelectItem>
                <SelectItem key="FEMALE" value="FEMALE">Femenino</SelectItem>
              </Select>

              <Input
                label="Correo electronico"
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

              {!isViewMode && (
                <>
                  <Input
                    label="Contraseña"
                    labelPlacement="outside"
                    name="password"
                    type={isVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={user ? "Escriba la nueva contraseña" : "Escriba la contraseña"}
                    isRequired={!user}
                    classNames={{
                      label: "font-semibold",
                    }}
                    endContent={
                      <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                      </button>
                    }
                  />
                  <Input
                    label="Verificar Contraseña"
                    labelPlacement="outside"
                    name="confirmPassword"
                    type={isVisible ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Verifique la contraseña"
                    isRequired={!user}
                    classNames={{
                      label: "font-semibold",
                    }}
                    endContent={
                      <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                      </button>
                    }
                  />
                </>
              )}

              {isViewMode && user && (
                <>
                  <Input
                    label="Fecha de creacion"
                    labelPlacement="outside"
                    value={new Date(user.created).toLocaleString()}
                    isDisabled={isViewMode}
                    className="col-span-2"
                    classNames={{
                      label: "font-semibold",
                    }}
                  />
                  <Input
                    label="Última actualización"
                    labelPlacement="outside"
                    value={new Date(user.updated).toLocaleString()}
                    isDisabled={isViewMode}
                    className="col-span-2"
                    classNames={{
                      label: "font-semibold",
                    }}
                  />
                </>
              )}
            </div>
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
