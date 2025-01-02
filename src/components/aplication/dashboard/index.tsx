'use client'

import React, { useContext } from 'react'
import { ProductContext } from '@/context/ProductContext/productContext'
import { ClientContext } from '@/context/ClientContext/clientContext'
import { OrderContext } from '@/context/OrderContext/orderContext'
import { DataCard } from './data-card'

export default function DashboardIndex() {
  const { products } = useContext(ProductContext)!
  const { clients } = useContext(ClientContext)!
  const { orders } = useContext(OrderContext)!

  return (
    <div className="p-2">

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

      {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">*/}
      {/*  <Card className="h-[400px]">*/}
      {/*    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">*/}
      {/*      <h4 className="font-bold text-large">Ventas Recientes</h4>*/}
      {/*    </CardHeader>*/}
      {/*    <CardBody className="overflow-y-auto py-2">*/}
      {/*      <RecentSalesTable orders={orders} />*/}
      {/*    </CardBody>*/}
      {/*  </Card>*/}
      {/*</div>*/}
    </div>
  )
}