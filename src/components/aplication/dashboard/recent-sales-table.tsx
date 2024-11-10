import React from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"

export const RecentSalesTable = ({ orders }) => {
  const recentOrders = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Table aria-label="Recent sales table">
      <TableHeader>
        <TableColumn>ORDER ID</TableColumn>
        <TableColumn>CLIENT</TableColumn>
        <TableColumn>DATE</TableColumn>
        <TableColumn>AMOUNT</TableColumn>
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