'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon';
import { UserDto } from '@/services/Dto/UserDto';
import { CreateUserDto } from '@/services/User/dto/CreateUserDto';
import { UpdateUserDto } from '@/services/User/dto/UpdateUserDto';
import { ToastType } from '@/components/Toast/Toast';
import { UserContext } from '@/context/UserContext/userContext';

interface Props {
  showToast: (message: string, type: ToastType) => void;
}

export default function UserModal({ showToast }: Props) {
  const { isModalOpen, closeModal, selectedUser, isViewMode, createUser, updateUser } = useContext(UserContext)!;


  const [formData, setFormData] = useState<Partial<CreateUserDto & UpdateUserDto & { confirmPassword: string } & {
    created_at: Date
  } & { updated_at: Date }>>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: '',
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        username: selectedUser.username,
        email: selectedUser.email,
        gender: selectedUser.gender,
        role: selectedUser.role,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSelectChange =(value:string) =>{
    setFormData({ ...formData, [value]: value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData as UpdateUserDto);
        showToast('Usuario actualizado exitosamente', ToastType.SUCCESS);
      } else {
        await createUser(formData as CreateUserDto);
        showToast('Usuario creado exitosamente', ToastType.SUCCESS);
      }
      closeModal();
    } catch (error) {
      showToast('Error al enviar los datos de la talla:' + error, ToastType.ERROR);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      classNames={{
        base: 'max-w-xl',
        header: 'border-b border-gray-200 dark:border-gray-700',
        footer: 'border-t border-gray-200 dark:border-gray-700',
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              {isViewMode ? 'Ver usuario' : selectedUser ? 'Editar usuario' : 'Agregar Usuario'}
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
                  label: 'font-semibold',
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
                  label: 'font-semibold',
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
                  label: 'font-semibold',
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
                  label: 'font-semibold',
                }}
              >

                <SelectItem key="MALE" value="MALE">Masculino</SelectItem>
                <SelectItem key="FEMALE" value="FEMALE">Femenino</SelectItem>
              </Select>
              <Select
                label="Rol"
                labelPlacement="outside"
                placeholder="Escoja el rol"
                selectedKeys={formData.role ? [formData.role] : []}
                onChange={(e) => handleSelectChange(e.target.value)}
                isRequired={!isViewMode}
                isDisabled={isViewMode}
                classNames={{
                  label: 'font-semibold',
                }}
              >

                <SelectItem key="admin" value="admin">Administrador</SelectItem>
                <SelectItem key="warehouse" value="warehouse">Almacenador</SelectItem>
                <SelectItem key="sales" value="sales">Vendedor</SelectItem>
                <SelectItem key="user" value="admin">Usuario</SelectItem>
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
                  label: 'font-semibold',
                }}
              />

              {!isViewMode && (
                <>
                  <Input
                    label="Contraseña"
                    labelPlacement="outside"
                    name="password"
                    type={isVisible ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={selectedUser ? 'Escriba la nueva contraseña' : 'Escriba la contraseña'}
                    isRequired={!selectedUser}
                    classNames={{
                      label: 'font-semibold',
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
                    type={isVisible ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Verifique la contraseña"
                    isRequired={!selectedUser}
                    classNames={{
                      label: 'font-semibold',
                    }}
                    endContent={
                      <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                      </button>
                    }
                  />
                </>
              )}

              {isViewMode && selectedUser && (
                <>
                  <Input
                    label="Fecha de creacion"
                    labelPlacement="outside"
                    value={new Date(selectedUser.created_at).toLocaleString()}
                    isDisabled={isViewMode}
                    className="col-span-2"
                    classNames={{
                      label: 'font-semibold',
                    }}
                  />
                  <Input
                    label="Última actualización"
                    labelPlacement="outside"
                    value={new Date(selectedUser.updated_at).toLocaleString()}
                    isDisabled={isViewMode}
                    className="col-span-2"
                    classNames={{
                      label: 'font-semibold',
                    }}
                  />
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {selectedUser ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
