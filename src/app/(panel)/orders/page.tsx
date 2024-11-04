
import Orders from '@/components/aplication/orders/Index';
import OrderProvider from '@/context/OrderContext/orderContext';
import React, { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <OrderProvider>
      <Orders />
      {children}
    </OrderProvider>
  );
}
