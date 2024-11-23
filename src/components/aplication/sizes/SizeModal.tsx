'use client'

import { useState, useEffect, useContext } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { CreateSizeDto } from '@/services/Size/dto/CreateSizeDto'
import { UpdateSizeDto } from '@/services/Size/dto/UpdateSizeDto'
import { SizeContext } from '@/context/SizeContext/sizeContext'
import { ToastType } from '@/components/Toast/Toast'

interface Props {
  showToast: (message: string, type: ToastType) => void;
}

export default function SizeModal({ showToast }: Props) {
  const { isModalOpen, closeModal, selectedSize, isViewMode, createSize, updateSize } = useContext(SizeContext)!;
  const [formData, setFormData] = useState<CreateSizeDto | UpdateSizeDto>({ name: '' });

  useEffect(() => {
    if (selectedSize) {
      setFormData({ name: selectedSize.name || '' });
    } else {
      setFormData({ name: '' });
    }
  }, [selectedSize]);

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSize) {
        await updateSize(selectedSize.id, formData as UpdateSizeDto);
        showToast("Talla actualizada exitosamente", ToastType.SUCCESS);
      } else {
        await createSize(formData as CreateSizeDto);
        showToast("Talla creada exitosamente", ToastType.SUCCESS);
      }
      closeModal();
    } catch (error) {
      showToast("Error al enviar los datos de la talla:" + error, ToastType.ERROR)
    }
  };

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
              {isViewMode ? 'Ver talla' : selectedSize ? 'Editar talla' : 'Agregar talla'}
            </h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={formData.name}
              onValueChange={handleInputChange}
              placeholder="Escriba el nombre de la talla"
              isRequired={!isViewMode}
              isDisabled={isViewMode}
              classNames={{
                label: "font-semibold",
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {selectedSize ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

