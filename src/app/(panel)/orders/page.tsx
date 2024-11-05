import Orders from '@/components/aplication/orders/Index';
import OrderProvider from '@/context/OrderContext/orderContext';
import React from 'react';

export default function Page() {
    return (
        <OrderProvider>
            <Orders/>
        </OrderProvider>
    );
}
