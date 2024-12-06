import Categories from '@/components/aplication/categories/Index';
import React from 'react';
import ProtectedRoute from "@/components/aplication/protectedRoute";
import {Roles} from "@/utils/routes";


export default function Page() {
    return (
        <ProtectedRoute roles={Roles.Categories}>
            <Categories/>
        </ProtectedRoute>
    );
}
