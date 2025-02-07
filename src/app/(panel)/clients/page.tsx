import React from 'react';
import ClientsPage from "@/components/aplication/clients/Index";
import ProtectedRoute from "@/components/aplication/protectedRoute";
import {Roles} from "@/utils/routes";

export default function Page() {
    return (

        <ProtectedRoute roles={Roles.Clients}>
            <ClientsPage/>
        </ProtectedRoute>
    );
}
