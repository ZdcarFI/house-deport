import Users from '@/components/aplication/users/Index';
import React from 'react';
import ProtectedRoute from "@/components/aplication/protectedRoute";
import {Roles} from "@/utils/routes";

export default function Page() {
    return (


        <ProtectedRoute roles={Roles.Users}>
            <Users/>
        </ProtectedRoute>
    );
}
