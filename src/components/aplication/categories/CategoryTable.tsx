import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { EditIcon } from '../../icons/table/edit-icon';
import { DeleteIcon } from '../../icons/table/delete-icon';
import { EyeIcon } from '../../icons/table/eye-icon';
import { CategoryDto } from '@/services/Dto/CategoryDto';

interface CategoryTableProps {
  categories: CategoryDto[];
  onView: (category: CategoryDto) => void;
  onEdit: (category: CategoryDto) => void;
  onDelete: (id: number) => void;
}

export default function CategoryTable({ categories, onView, onEdit, onDelete }: CategoryTableProps) {
  const renderCell = (category: CategoryDto, columnKey: React.Key) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-4">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(category)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit category" color="secondary">
              <button onClick={() => onEdit(category)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete category" color="danger">
              <button onClick={() => onDelete(category.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        );
      case 'sizes':
        return category.sizes.map(size => size.name).join(', ');
      default:
        return null
    }
  };

  return (
    <Table aria-label="Categories table">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Sizes</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{renderCell(category, 'sizes')}</TableCell>
            <TableCell>{renderCell(category, 'actions')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}