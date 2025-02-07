import Warehouses from '@/components/aplication/warehouses'
import React from 'react'
import ProtectedRoute from "@/components/aplication/protectedRoute";
import {Roles} from "@/utils/routes";

export default function page() {
    return (

    <ProtectedRoute roles={Roles.Warehouses}>
        <Warehouses />
    </ProtectedRoute>
    )
}
