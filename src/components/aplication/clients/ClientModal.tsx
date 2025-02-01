'use client'

import React, {useState, useEffect, useContext} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/modal'
import {Button} from '@nextui-org/button'
import {Input} from '@nextui-org/input'
import {ClientDto} from '@/services/Dto/ClienDto'
import {Select, SelectItem} from "@nextui-org/select";
import {ToastType} from '@/components/Toast/Toast'
import {ClientContext} from '@/context/ClientContext/clientContext'
import {UpdateClientDto} from '@/services/Client/dto/UpdateClientDto'
import {CreateClientDto} from '@/services/Client/dto/CreateClientDto'

interface Props {
    showToast: (message: string, type: ToastType) => void;
}

export default function ClientModal({showToast}: Props) {
    const {
        isModalOpen,
        closeModal,
        selectedClient,
        isViewMode,
        createClient,
        updateClient
    } = useContext(ClientContext)!;
    const [formData, setFormData] = useState<ClientDto>({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        numberDocument: '',
        typeDocument: '',
        createdAt: "",
        created_at: new Date(),
        updated_at: new Date()
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
                createdAt: "",
                created_at: new Date(),
                updated_at: new Date()
            })
        }
    }, [selectedClient])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    const handleSelectChange = (name: string) => (value: string) => {
        if (name === 'typeDocument') {
            const documentType = value || '';
            setFormData({
                ...formData,
                typeDocument: documentType,
                numberDocument: '',
                email: documentType === 'RUC' ? formData.email : ''
            });
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.typeDocument && formData.typeDocument !== '') {
            if (formData.typeDocument === 'DNI' && formData.numberDocument && formData.numberDocument.length !== 8) {
                showToast("El DNI debe tener exactamente 8 dígitos", ToastType.ERROR);
                return;
            }

            if (
                formData.typeDocument === 'RUC' &&
                formData.numberDocument &&
                ![10, 20].includes(formData.numberDocument.length)
            ) {
                showToast("El RUC debe tener 10 o 20 dígitos", ToastType.ERROR);
                return;
            }

            if (formData.typeDocument === 'RUC' && formData.numberDocument && !formData.email) {
                showToast("El campo 'Tipo Contribuyente' es requerido cuando se ingresa RUC", ToastType.ERROR);
                return;
            }
        }


        if (!formData.firstName) {
            showToast("El campo de 'Nombre' no puede estar vacío, incluya un nombre como minimo", ToastType.ERROR);
            return;
        }
        if (!formData.lastName) {
            showToast("El campo de 'Apellido' no puede estar vacío, incluya un apellido como minimo", ToastType.ERROR);
            return;
        }

        const updatedFormData = {
            ...formData,
            typeDocument: formData.typeDocument || '',
            numberDocument: formData.numberDocument || '',
        };

        try {
            if (selectedClient) {
                await updateClient(selectedClient.id, updatedFormData as UpdateClientDto);
                showToast("Cliente actualizada exitosamente", ToastType.SUCCESS);
            } else {
                await createClient(updatedFormData as CreateClientDto);
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

                            <Select
                                label="Tipo de Documento"
                                labelPlacement="outside"
                                name="typeDocument"
                                placeholder="Seleccione un tipo de documento (opcional)"
                                selectedKeys={formData.typeDocument ? [formData.typeDocument] : []}
                                onChange={(e) => handleSelectChange('typeDocument')(e.target.value)}
                                isDisabled={isViewMode || Boolean(selectedClient)}
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
                            <Input
                                label="Número de Documento"
                                labelPlacement="outside"
                                name="numberDocument"
                                value={formData.numberDocument}
                                onChange={handleInputChange}
                                placeholder={formData.typeDocument === 'RUC' ? "Escribe el RUC" : formData.typeDocument === 'DNI' ? "Escribe el DNI" : "Escoja el tipo de documento"}
                                isDisabled={isViewMode || !formData.typeDocument}
                                type="number"
                                classNames={{
                                    label: "font-semibold",
                                }}
                            />
                            {formData.typeDocument === 'RUC' && (
                                <Input
                                    label="Tipo Contribuyente"
                                    labelPlacement="outside"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Escriba el tipo de contribuyente"
                                    isRequired={formData.typeDocument === 'RUC' && Boolean(formData.numberDocument)}
                                    isDisabled={isViewMode}
                                    className="col-span-2"
                                    classNames={{
                                        label: "font-semibold",
                                    }}
                                />
                            )}

                            <Input
                                label="Celular"
                                labelPlacement="outside"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Escriba el numero de celular"
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
                                {selectedClient ? 'Actualizar' : 'Crear'}
                            </Button>
                        )}
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}