import Users from '@/components/aplication/users/Index';
import UserProvider from '@/context/UserContext/userContext';
import React, { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <UserProvider>
      <Users />
      {children}
    </UserProvider>
  );
}
