'use client'

import React, { useContext, useMemo } from 'react'
import { OrderContext } from '@/context/OrderContext/orderContext'

export const BenefitCostRatio: React.FC = () => {
  const { orders } = useContext(OrderContext)!

  const monthlyRatio = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.date)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    const totalRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0)
    const totalCost = monthlyOrders.reduce((sum, order) => sum + order.subtotal, 0)

    return totalRevenue / totalCost
  }, [orders])

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary">Relación Beneficio/Costo del Mes Actual</h3>
      <p className={`text-4xl font-bold mb-2 ${monthlyRatio >= 1 ? 'text-primary dark:text-primary' : 'text-destructive dark:text-destructive'}`}>
        {monthlyRatio.toFixed(2)}
      </p>
      <p className="text-sm text-muted-foreground dark:text-muted-foreground">
        Un valor mayor a 1 indica beneficio, menor a 1 indica pérdida.
      </p>
    </div>
  )
}

