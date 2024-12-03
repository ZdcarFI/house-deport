'use client'

import React, { useContext, useMemo } from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { ProductContext } from '@/context/ProductContext/productContext'
import { CategoryContext } from '@/context/CategoryContext/categoryContext'
import { ClientContext } from '@/context/ClientContext/clientContext'
import { OrderContext } from '@/context/OrderContext/orderContext'
import { DataCard } from './data-card'
import { LineChart } from './line-chart'
import { PieChart } from './pie-chart'
import { RecentSalesTable } from './recent-sales-table'

const calculateTrend = (currentValue: number, previousValue: number): { trendText: string; status: 'success' | 'error' } => {
  const percentageChange = ((currentValue - previousValue) / previousValue) * 100
  const trendText = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(2)}%`
  const status = percentageChange >= 0 ? 'success' : 'error'
  return { trendText, status }
}

export default function Dashboard() {
  const { products } = useContext(ProductContext)!
  const { categories } = useContext(CategoryContext)!
  const { clients } = useContext(ClientContext)!
  const { orders } = useContext(OrderContext)!

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Total de ingresos"
          content={`S/.${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`}
          subText="vs ultimo mes"
          trendText={`S/.${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`}
          status="success"
          icon="dollar"
        />
        <DataCard
          title="Total de productos"
          content={products.length.toString()}
          subText="vs ultimo mes"
          trendText={products.length.toString()}
          status="success"
          icon="package"
        />
        <DataCard
          title="Total de clientes"
          content={clients.length.toString()}
          subText="vs ultimo mes"
          trendText={clients.length.toString()}
          status="success"
          icon="users"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-[400px]">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Ventas Recientes</h4>
          </CardHeader>
          <CardBody className="overflow-y-auto py-2">
            <RecentSalesTable orders={orders} />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}