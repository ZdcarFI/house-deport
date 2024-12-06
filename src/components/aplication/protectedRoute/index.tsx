'use client'

import {useContext, useEffect} from 'react';
import {AuthContext} from "@/context/AuthContext/authContext";
import {useRouter} from "next/navigation";

interface ProtectedRouteProps {
    roles: string[];
    children: React.ReactNode;
}

const ProtectedRoute = ({ roles, children }:ProtectedRouteProps) => {
    const { user } = useContext(AuthContext);
    const userRole = user.role;
    const router = useRouter()

    useEffect(() => {
        if (!userRole || !roles.includes(userRole)) {
            router.push('/unauthorized');
        }
    }, [userRole, roles, router]);

    return userRole && roles.includes(userRole) ? children : null;
};

export default ProtectedRoute;
