import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { ProductWarehouseDto } from '@/services/Dto/ProductWarehouseDto';
import { Tooltip } from '@nextui-org/tooltip';
import { EditIcon } from '../../icons/table/edit-icon';
import { DeleteIcon } from '../../icons/table/delete-icon';
import { EyeIcon } from '../../icons/table/eye-icon';
import React from 'react';

interface ProductWarehouseTableProps {
  productWarehouses: ProductWarehouseDto[];
  onView: (productWarehouse: ProductWarehouseDto) => void;
  onEdit: (productWarehouse: ProductWarehouseDto) => void;
  onDelete: (id: number) => void;
}

export default function ProductWarehouseTable({
                                                productWarehouses,
                                                onEdit,
                                                onDelete,
                                                onView,
                                              }: ProductWarehouseTableProps) {
  const renderCell = (productWarehouse: ProductWarehouseDto, columnKey: React.Key) => {
    switch (columnKey) {
      case 'product':
        return productWarehouse.product?.name ?? ''; // Ensure product name is a string
      case 'warehouse':
        return productWarehouse.warehouse?.name ?? ''; // Ensure warehouse name is a string
      case 'quantity':
        return productWarehouse.quantity?.toString() ?? ''; // Ensure quantity is a string or number
      case 'location':
        return `Row: ${productWarehouse.row}, Column: ${productWarehouse.column}`;
      case 'actions':
        return (
          <div className="flex items-center gap-4">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(productWarehouse)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit product warehouse" color="secondary">
              <button onClick={() => onEdit(productWarehouse)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete product warehouse" color="danger">
              <button onClick={() => onDelete(productWarehouse.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <Table aria-label="Product Warehouses table">
      <TableHeader>
        <TableColumn>Producto</TableColumn>
        <TableColumn>Almacen</TableColumn>
        <TableColumn>Cantidad</TableColumn>
        <TableColumn>Ubicacion</TableColumn>
        <TableColumn>Fecha de creación</TableColumn>
        <TableColumn>Fecha de actualización</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {productWarehouses.map((productWarehouse) => (
          <TableRow key={productWarehouse.id}>
            <TableCell>{renderCell(productWarehouse, 'product')}</TableCell>
            <TableCell>{renderCell(productWarehouse, 'warehouse')}</TableCell>
            <TableCell>{renderCell(productWarehouse, 'quantity')}</TableCell>
            <TableCell>{renderCell(productWarehouse, 'location')}</TableCell>
            <TableCell>{new Date(productWarehouse.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(productWarehouse.updated_at).toLocaleDateString()}</TableCell>
            <TableCell>{renderCell(productWarehouse, 'actions')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}