'use client'

import React, { useContext, useMemo } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { ProductContext } from '@/context/ProductContext/productContext'

export const OldProductsReport: React.FC = () => {
  const { products } = useContext(ProductContext)!

  const oldProducts = useMemo(() => {
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

    return products.filter(product => new Date(product.created_at) <= threeYearsAgo)
  }, [products])

  const percentage = (oldProducts.length / products.length) * 100

  return (
    <div>
      <p className="mb-4 text-foreground dark:text-foreground">Porcentaje de productos con más de 3 años: {percentage.toFixed(2)}%</p>
      <Table aria-label="Productos con más de 3 años" className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
        <TableHeader>
          <TableColumn className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground">Nombre</TableColumn>
          <TableColumn className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground">Código</TableColumn>
          <TableColumn className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground">Fecha de creación</TableColumn>
        </TableHeader>
        <TableBody>
          {oldProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/50 dark:hover:bg-muted/50">
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.code}</TableCell>
              <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

