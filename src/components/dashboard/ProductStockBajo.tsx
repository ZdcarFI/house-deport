'use client';

import React, { useContext, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge } from '@nextui-org/react';
import { ProductContext } from '@/context/ProductContext/productContext';
import { OrderContext } from '@/context/OrderContext/orderContext';

export const LowStockNotification: React.FC = () => {
  const { products } = useContext(ProductContext)!;
  const { orders } = useContext(OrderContext)!;
  const lowStockProducts = useMemo(() => {
    return products.filter(product => {
      const totalStock = product.productWarehouse.reduce((sum, warehouse) => sum + warehouse.quantity, 0);
      return totalStock <= 20;
    });
  }, [products]);

  return (
    <Table aria-label="Productos con stock bajo"
           className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
      <TableHeader>
        <TableColumn
          className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground">Nombre</TableColumn>
        <TableColumn
          className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground">Código</TableColumn>
        <TableColumn className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground">Stock
          Total</TableColumn>
        <TableColumn
          className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground">Estado</TableColumn>
      </TableHeader>
      <TableBody>
        {lowStockProducts.map((product) => {
          const totalStock = product.productWarehouse.reduce((sum, warehouse) => sum + warehouse.quantity, 0);
          return (
            <TableRow key={product.id} className="hover:bg-muted/50 dark:hover:bg-muted/50">
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.code}</TableCell>
              <TableCell>{totalStock}</TableCell>
              <TableCell>
                <Badge color={totalStock <= 10 ? 'danger' : 'warning'} variant="flat">
                  {totalStock <= 10 ? 'Crítico' : 'Bajo'}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

