'use client';

import React, { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { OrderContext } from '@/context/OrderContext/orderContext';

export const ProductSalesPercentage: React.FC = () => {
  const { orders } = useContext(OrderContext)!;

  const productSales = useMemo(() => {
    const sales: { [key: string]: number } = {};
    let totalSales = 0;

    orders.forEach(order => {
      order.details.forEach(detail => {
        const productName = detail.product.name;
        sales[productName] = (sales[productName] || 0) + detail.total;
        totalSales += detail.total;
      });
    });

    return Object.entries(sales)
        .map(([name, value]) => ({
          name,
          value,
          percentage: ((value / totalSales) * 100).toFixed(2),
        }))
        .sort((a, b) => b.value - a.value) // Ordenar de mayor a menor
        .slice(0, 10); // Tomar solo los 10 primeros
  }, [orders]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A28DFF', '#FF6680', '#66CCFF', '#FF99CC', '#99FF99'];

  return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
              data={productSales}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {productSales.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
  );
};
