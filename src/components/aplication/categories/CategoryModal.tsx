import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { CategoryDto } from '@/services/Dto/CategoryDto';
import { SizeDto } from '@/services/Dto/SizeDto';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CategoryDto) => void;
  category: CategoryDto | null;
  isViewMode: boolean;
}

export default function CategoryModal({ isOpen, onClose, onSubmit, category, isViewMode }: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryDto>({
    id: 0,
    name: '',
    sizes: [],
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        id: 0,
        name: '',
        sizes: [],
      });
    }
  }, [category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isViewMode ? 'View Category' : category ? 'Edit Category' : 'Add Category'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              isReadOnly={isViewMode}
            />
            {isViewMode && (
              <div>
                <h4>Sizes:</h4>
                <ul>
                  {formData.sizes.map((size: SizeDto) => (
                    <li key={size.id}>{size.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {!isViewMode && (
              <Button color="primary" type="submit">
                {category ? 'Update' : 'Create'}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}