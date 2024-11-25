import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { EditIcon } from '../../icons/table/edit-icon';
import { DeleteIcon } from '../../icons/table/delete-icon';
import { EyeIcon } from '../../icons/table/eye-icon';
import { ProductDto } from '@/services/Dto/ProductDto';

interface ProductTableProps {
  products: ProductDto[];
  onView: (product: ProductDto) => void;
  onEdit: (product: ProductDto) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onView, onEdit, onDelete }: ProductTableProps) {

  const renderCell = (product: ProductDto, columnKey: React.Key): React.ReactNode => {


    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-4">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(product)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit product" color="secondary">
              <button onClick={() => onEdit(product)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete product" color="danger">
              <button onClick={() => onDelete(product.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        );
      case 'category':
        return product.category?.name ?? "N/A";
      case 'size':
        return product.size?.name ?? "N/A";
      case 'warehouse':
        return product.productWarehouse[0]?.name  ?? "N/A";
      case 'stockInventory':
        return product.stockInventory ?? "N/A";
      case 'stockStore':
        return product.stockStore ?? "N/A";
      default:
        return product[columnKey as keyof ProductDto]?.toString() ?? "N/A";
    }
  };

  return (
    <Table aria-label="Products table">
      <TableHeader>
        <TableColumn key="name">Nombre</TableColumn>
        <TableColumn key="code">Código</TableColumn>
        <TableColumn key="price">Precio</TableColumn>
        <TableColumn key="category">Categoria</TableColumn>
        <TableColumn key="size">Talla</TableColumn>
        <TableColumn key="stockInventory">Stock en el inventario</TableColumn>
        <TableColumn key="stockStore">Stock en los almacenes</TableColumn>
        <TableColumn key="actions">Acciones</TableColumn>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            {(columnKey) => <TableCell>{renderCell(product, columnKey)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
