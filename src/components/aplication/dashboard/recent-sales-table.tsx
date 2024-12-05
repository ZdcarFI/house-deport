import React, { useContext } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { OrderContext } from '@/context/OrderContext/orderContext';

export const RecentSalesTable = () => {

 const { orders } = useContext(OrderContext)!
  const recentOrders = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Table aria-label="Recent sales table">
      <TableHeader>
        <TableColumn>Orden</TableColumn>
        <TableColumn>Cliente</TableColumn>
        <TableColumn>Fecha</TableColumn>
        <TableColumn>Monto</TableColumn>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{`${order.client.firstName} ${order.client.lastName}`}</TableCell>
            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}