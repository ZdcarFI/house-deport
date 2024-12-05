// 'use client'

// import React, { useContext, useMemo } from 'react'
// import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"
// import { ProductContext } from '@/context/ProductContext/productContext'
// import { CategoryContext } from '@/context/CategoryContext/categoryContext'
// import { ClientContext } from '@/context/ClientContext/clientContext'
// import { OrderContext } from '@/context/OrderContext/orderContext'
// import { DollarSign, Package, ShoppingBag, Users } from "lucide-react"

// interface SalesByMonth {
//   month: string
//   sales: number
// }

// interface TopProduct {
//   name: string
//   quantity: number
// }

// export default function Dashboard() {
//   const { products } = useContext(ProductContext)!
//   const { categories } = useContext(CategoryContext)!
//   const { clients } = useContext(ClientContext)!
//   const { orders } = useContext(OrderContext)!

//   const monthlySales = useMemo<SalesByMonth[]>(() => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//     const salesByMonth = new Array(12).fill(0)

//     orders.forEach(order => {
//       const month = new Date(order.date).getMonth()
//       salesByMonth[month] += order.total
//     })

//     return months.map((month, index) => ({
//       month,
//       sales: salesByMonth[index]
//     }))
//   }, [orders])

//   const topSellingProducts = useMemo<TopProduct[]>(() => {
//     const productSales: Record<number, number> = {}
//     orders.forEach(order => {
//       order.details?.forEach(detail => {
//         const productId = detail.product?.id
//         if (productId) {
//           productSales[productId] = (productSales[productId] || 0) + (detail.quantity || 0)
//         }
//       })
//     })

//     return Object.entries(productSales)
//       .map(([id, quantity]) => ({
//         name: products.find(p => p.id === parseInt(id))?.name || 'Unknown',
//         quantity
//       }))
//       .sort((a, b) => b.quantity - a.quantity)
//       .slice(0, 5)
//   }, [orders, products])

//   const recentSales = useMemo(() => {
//     return orders
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//       .slice(0, 5)
//   }, [orders])

//   const totalRevenue = useMemo(() => {
//     return orders.reduce((sum, order) => sum + (order.total || 0), 0)
//   }, [orders])

//   const averageOrderValue = useMemo(() => {
//     return orders.length ? totalRevenue / orders.length : 0
//   }, [orders, totalRevenue])

//   return (
//     <div className="p-8 space-y-8">
//       <h1 className="text-3xl font-bold">Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardBody className="flex flex-row items-center gap-4">
//             <div className="p-2 bg-primary-100 rounded-full">
//               <DollarSign className="h-6 w-6 text-primary-500" />
//             </div>
//             <div>
//               <p className="text-sm">Total Revenue</p>
//               <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
//             </div>
//           </CardBody>
//         </Card>

//         <Card>
//           <CardBody className="flex flex-row items-center gap-4">
//             <div className="p-2 bg-primary-100 rounded-full">
//               <Package className="h-6 w-6 text-primary-500" />
//             </div>
//             <div>
//               <p className="text-sm">Total Products</p>
//               <p className="text-2xl font-bold">{products.length}</p>
//             </div>
//           </CardBody>
//         </Card>

//         <Card>
//           <CardBody className="flex flex-row items-center gap-4">
//             <div className="p-2 bg-primary-100 rounded-full">
//               <Users className="h-6 w-6 text-primary-500" />
//             </div>
//             <div>
//               <p className="text-sm">Total Clients</p>
//               <p className="text-2xl font-bold">{clients.length}</p>
//             </div>
//           </CardBody>
//         </Card>

//         <Card>
//           <CardBody className="flex flex-row items-center gap-4">
//             <div className="p-2 bg-primary-100 rounded-full">
//               <ShoppingBag className="h-6 w-6 text-primary-500" />
//             </div>
//             <div>
//               <p className="text-sm">Average Order</p>
//               <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
//             </div>
//           </CardBody>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid gap-4 md:grid-cols-2">
//         <Card>
//           <CardHeader className="flex gap-3">
//             <div className="flex flex-col">
//               <p className="text-lg font-bold">Monthly Sales</p>
//             </div>
//           </CardHeader>
//           <CardBody>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={monthlySales}>
//                 <Bar dataKey="sales" fill="#8884d8" />
//                 <Tooltip />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardBody>
//         </Card>

//         <Card>
//           <CardHeader className="flex gap-3">
//             <div className="flex flex-col">
//               <p className="text-lg font-bold">Sales Trend</p>
//             </div>
//           </CardHeader>
//           <CardBody>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={monthlySales}>
//                 <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
//                 <Tooltip />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardBody>
//         </Card>

//         <Card>
//           <CardHeader className="flex gap-3">
//             <div className="flex flex-col">
//               <p className="text-lg font-bold">Top Selling Products</p>
//             </div>
//           </CardHeader>
//           <CardBody>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={topSellingProducts}
//                   dataKey="quantity"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#8884d8"
//                   label
//                 />
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardBody>
//         </Card>

//         <Card>
//           <CardHeader className="flex gap-3">
//             <div className="flex flex-col">
//               <p className="text-lg font-bold">Recent Sales</p>
//             </div>
//           </CardHeader>
//           <CardBody>
//             <Table aria-label="Recent sales table">
//               <TableHeader>
//                 <TableColumn>ORDER ID</TableColumn>
//                 <TableColumn>CLIENT</TableColumn>
//                 <TableColumn>DATE</TableColumn>
//                 <TableColumn>AMOUNT</TableColumn>
//               </TableHeader>
//               <TableBody>
//                 {recentSales.map((sale) => (
//                   <TableRow key={sale.id}>
//                     <TableCell>#{sale.id}</TableCell>
//                     <TableCell>{sale.client?.firstName} {sale.client?.lastName}</TableCell>
//                     <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
//                     <TableCell>${sale.total?.toFixed(2)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   )
// }

// import Dashboard from '@/components/aplication/dashboard'
// import React from 'react'
//
// export default function page() {
//   return (
//<Dashboard />
//   )
// }


'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { ProductSalesPercentage } from '@/components/dashboard/ProductosVentas';
import { OldProductsReport } from '@/components/dashboard/ProductosAntiguos';
import { BenefitCostRatio } from '@/components/dashboard/Beneficio-Costo';
import { LowStockNotification } from '@/components/dashboard/ProductStockBajo';
import { DailySalesChart } from '@/components/dashboard/VentasDiarias';
import { DateRangePicker } from '@/components/dashboard/RangoTiempo';
import DashboardIndex from '@/components/aplication/dashboard';
import { RecentSalesTable } from '@/components/aplication/dashboard/recent-sales-table';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });

  return (
    <div className="p-8 bg-background dark:bg-background text-foreground dark:text-foreground min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-primary dark:text-primary">Dashboard</h1>
      <DashboardIndex />
      <div className="grid grid-cols-1  gap-8 mb-8">
        <DateRangePicker onChange={setDateRange} />
        <Card className="h-[400px] bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Ventas Diarias y Mensuales</h4>
          </CardHeader>
          <CardBody>
            <DailySalesChart dateRange={dateRange} />
          </CardBody>
        </Card>

        <Card className="h-[400px] bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Porcentaje de Ventas por Producto</h4>
          </CardHeader>
          <CardBody>
            <ProductSalesPercentage />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Productos en Tienda por más de 3 Años</h4>
          </CardHeader>
          <CardBody>
            <OldProductsReport />
          </CardBody>
        </Card>

        <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Relación Beneficio/Costo</h4>
          </CardHeader>
          <CardBody>
            <BenefitCostRatio />
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Notificaciones de Stock Bajo</h4>
          </CardHeader>
          <CardBody>
            <LowStockNotification />
          </CardBody>
        </Card>

        <Card className="h-[400px]">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Ventas Recientes</h4>
          </CardHeader>
          <CardBody className="overflow-y-auto py-2">
            <RecentSalesTable />
          </CardBody>
        </Card>
      </div>

    </div>
  );
}
