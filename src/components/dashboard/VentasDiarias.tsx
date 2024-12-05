'use client';

import React, { useContext, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OrderContext } from '@/context/OrderContext/orderContext';
import { OrderDto } from '@/services/Dto/OrderDto';

interface DailySalesChartProps {
  dateRange: { start: Date; end: Date };
}

export const DailySalesChart: React.FC<DailySalesChartProps> = ({ dateRange }) => {
  const { orders } = useContext(OrderContext)!;

  const filteredData = useMemo(() => {
    return orders.filter((order: OrderDto) => {
      const orderDate = new Date(order.date);
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });
  }, [orders, dateRange]);

  const chartData = useMemo(() => {
    const dailySales: { [key: string]: number } = {};
    filteredData.forEach((order: OrderDto) => {
      const date = new Date(order.date).toISOString().split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + order.total;
    });
    return Object.entries(dailySales)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border dark:stroke-border" />
        <XAxis dataKey="date" className="text-foreground dark:text-foreground" />
        <YAxis className="text-foreground dark:text-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--card-foreground))',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          name="Ventas Diarias"
          className="stroke-primary dark:stroke-primary"
          activeDot={{ r: 8, className: 'fill-primary dark:fill-primary' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
