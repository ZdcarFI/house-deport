import CreateOrderPage from '@/components/aplication/orders/CreateOrder'
import React from 'react'
import ProtectedRoute from "@/components/aplication/protectedRoute";
import {Roles} from "@/utils/routes";

export default function page() {
    return (
        <ProtectedRoute roles={Roles.Orders}>
            <CreateOrderPage/>
        </ProtectedRoute>
    )
}
