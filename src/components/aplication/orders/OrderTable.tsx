import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { EditIcon } from '../../icons/table/edit-icon';
import { DeleteIcon } from '../../icons/table/delete-icon';
import { EyeIcon } from '../../icons/table/eye-icon';
import { OrderDto } from '@/services/Dto/OrderDto';

interface OrderTableProps {
  orders: OrderDto[];
  onView: (order: OrderDto) => void;
  onEdit: (order: OrderDto) => void;
  onDelete: (id: number) => void;
}

export default function OrderTable({ orders, onView, onEdit, onDelete }: OrderTableProps) {
  const renderCell = (order: OrderDto, columnKey: React.Key) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-4">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(order)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit order" color="secondary">
              <button onClick={() => onEdit(order)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete order" color="danger">
              <button onClick={() => onDelete(order.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        );
      case 'products':
        return order.products?.length ?? 0;  
      default:
        return order[columnKey as keyof OrderDto];
    }
  };

  return (
    <Table aria-label="Orders table">
      <TableHeader>
        <TableColumn>Invoice Number</TableColumn>
        <TableColumn>Client ID</TableColumn>
        <TableColumn>User ID</TableColumn>
        <TableColumn>Number of Products</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.numFac}</TableCell>
            <TableCell>{order.clientId}</TableCell>
            <TableCell>{order.userId}</TableCell>
            <TableCell>{renderCell(order, 'products')}</TableCell>
            <TableCell>{renderCell(order, 'actions')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}