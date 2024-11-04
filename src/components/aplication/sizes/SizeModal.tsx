'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { SizeDto } from '@/services/Dto/SizeDto'
import { CreateSizeDto } from '@/services/Size/dto/CreateSizeDto'
import { UpdateSizeDto } from '@/services/Size/dto/UpdateSizeDto'
import { CategoryDto } from '@/services/Dto/CategoryDto'

interface SizeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: CreateSizeDto | UpdateSizeDto) => void
  size: SizeDto | null
  isViewMode: boolean
  categories: CategoryDto[]
}

export default function SizeModal({ isOpen, onClose, onSubmit, size, isViewMode, categories }: SizeModalProps) {
  const [formData, setFormData] = useState<CreateSizeDto | UpdateSizeDto>({
    name: '',
    categoryId: categories[0]?.id || 0,
  })

  useEffect(() => {
    if (size) {
      setFormData({
        name: size.name || '',
        categoryId: size.categoryId || categories[0]?.id || 0
      })
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id || 0
      })
    }
  }, [size, categories])

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value }))
  }

  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value) || categories[0]?.id || 0
    setFormData(prev => ({ ...prev, categoryId }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const categoryIdString = (formData.categoryId || categories[0]?.id || 0).toString()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'View Size' : size ? 'Edit Size' : 'Add Size'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={formData.name}
              onValueChange={handleInputChange}
              isReadOnly={isViewMode}
            />
            <Select
              label="Category"
              selectedKeys={[categoryIdString]}
              defaultSelectedKeys={[categoryIdString]}
              onChange={(e) => handleCategoryChange(e.target.value)}
              isDisabled={isViewMode}
            >
              {categories.map((category) => (
                <SelectItem key={category.id.toString()} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {size ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}