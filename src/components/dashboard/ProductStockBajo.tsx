'use client';

import React, {useContext, useMemo} from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/react';
import {ProductContext} from '@/context/ProductContext/productContext';

export const LowStockNotification: React.FC = () => {
    const {products} = useContext(ProductContext)!;

    const lowStockProducts = useMemo(() => {
        return products.filter(product => {
            const totalStock = product.productWarehouse.reduce((sum, warehouse) => sum + warehouse.quantity, 0);
            return totalStock <= 5;
        });
    }, [products]);

    return (
        <Table aria-label="Productos con stock bajo"
               className="bg-card dark:bg-card ">
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

                    let status = '';
                    let bgColor = "";

                    if (totalStock <= 3) {
                        status = 'Crítico';
                        bgColor = "bg-red-500 text-white";
                    } else if (totalStock <= 5) {
                        status = 'Bajo';
                        bgColor = "bg-yellow-500 text-black";
                    }

                    return (
                        <TableRow key={product.id} className="hover:bg-muted/50 dark:hover:bg-muted/50">
                            <TableCell className='py-2'>{product.name}</TableCell>
                            <TableCell>{product.code}</TableCell>
                            <TableCell>{totalStock}</TableCell>
                            <TableCell className="py-2">
                                <span
                                    className={`${bgColor} inline-block text-center font-semibold px-3 py-1 rounded-md`}>
                                    {status}
                                </span>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
