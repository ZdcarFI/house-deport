'use client'

import {useContext, useEffect} from 'react';
import {AuthContext} from "@/context/AuthContext/authContext";
import {useRouter} from "next/navigation";

interface ProtectedRouteProps {
    roles: string[];
    children: React.ReactNode;
}

const ProtectedRoute = ({ roles, children }:ProtectedRouteProps) => {
    const { user, loading } = useContext(AuthContext);
    const userRole = user.role;
    const router = useRouter()

    useEffect(() => {
        if (!loading && (!userRole || !roles.includes(userRole))) {
            router.push('/unauthorized');
        }
    }, [userRole, roles, router, loading]);

    return <>{userRole && roles.includes(userRole) ? children : null}</>;
};

export default ProtectedRoute;
