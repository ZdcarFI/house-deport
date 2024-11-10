'use client'

import React, { useContext, useMemo } from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { ProductContext } from '@/context/ProductContext/productContext'
import { CategoryContext } from '@/context/CategoryContext/categoryContext'
import { ClientContext } from '@/context/ClientContext/clientContext'
import { OrderContext } from '@/context/OrderContext/orderContext'
import { DataCard } from './data-card'
import { LineChart } from './line-chart'
import { BarChart } from './bar-chart'
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

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const metrics = useMemo(() => {
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.date)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    const previousMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.date)
      return orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousYear
    })

    const currentRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0)
    const previousRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total, 0)

    const currentAverageOrderValue = currentMonthOrders.length > 0 ? currentRevenue / currentMonthOrders.length : 0
    const previousAverageOrderValue = previousMonthOrders.length > 0 ? previousRevenue / previousMonthOrders.length : 0

    const currentProductCount = products.filter(product => {
      const createdDate = new Date(product.createdAt)
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
    }).length
    const previousProductCount = products.filter(product => {
      const createdDate = new Date(product.createdAt)
      return createdDate.getMonth() === previousMonth && createdDate.getFullYear() === previousYear
    }).length

    const currentClientCount = clients.filter(client => {
      const createdDate = new Date(client.createdAt)
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
    }).length
    const previousClientCount = clients.filter(client => {
      const createdDate = new Date(client.createdAt)
      return createdDate.getMonth() === previousMonth && createdDate.getFullYear() === previousYear
    }).length

    return {
      totalRevenue: { current: currentRevenue, previous: previousRevenue },
      totalProducts: { current: currentProductCount, previous: previousProductCount },
      totalClients: { current: currentClientCount, previous: previousClientCount },
      averageOrderValue: { current: currentAverageOrderValue, previous: previousAverageOrderValue }
    }
  }, [orders, products, clients, currentMonth, currentYear, previousMonth, previousYear])

  const revenueTrend = calculateTrend(metrics.totalRevenue.current, metrics.totalRevenue.previous)
  const productsTrend = calculateTrend(metrics.totalProducts.current, metrics.totalProducts.previous)
  const clientsTrend = calculateTrend(metrics.totalClients.current, metrics.totalClients.previous)
  const avgOrderValueTrend = calculateTrend(metrics.averageOrderValue.current, metrics.averageOrderValue.previous)

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Total Revenue"
          content={`$${metrics.totalRevenue.current.toFixed(2)}`}
          subText="vs last month"
          trendText={revenueTrend.trendText}
          status={revenueTrend.status}
          icon="dollar"
        />
        <DataCard
          title="Total Products"
          content={metrics.totalProducts.current.toString()}
          subText="vs last month"
          trendText={productsTrend.trendText}
          status={productsTrend.status}
          icon="package"
        />
        <DataCard
          title="Total Clients"
          content={metrics.totalClients.current.toString()}
          subText="vs last month"
          trendText={clientsTrend.trendText}
          status={clientsTrend.status}
          icon="users"
        />
        <DataCard
          title="Avg Order Value"
          content={`$${metrics.averageOrderValue.current.toFixed(2)}`}
          subText="vs last month"
          trendText={avgOrderValueTrend.trendText}
          status={avgOrderValueTrend.status}
          icon="shopping-cart"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-[400px]">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Monthly Sales</h4>
          </CardHeader>
          <CardBody className="overflow-hidden py-2">
            <LineChart orders={orders} />
          </CardBody>
        </Card>
        <Card className="h-[400px]">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Top Selling Products</h4>
          </CardHeader>
          <CardBody className="overflow-hidden py-2">
            <BarChart products={products} orders={orders} />
          </CardBody>
        </Card>
        <Card className="h-[400px]">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Product Categories</h4>
          </CardHeader>
          <CardBody className="overflow-hidden py-2">
            <PieChart categories={categories} products={products} />
          </CardBody>
        </Card>
        <Card className="h-[400px]">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Recent Sales</h4>
          </CardHeader>
          <CardBody className="overflow-y-auto py-2">
            <RecentSalesTable orders={orders} />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}