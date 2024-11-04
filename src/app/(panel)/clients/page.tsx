import Clients from '@/components/aplication/clients/Index';
import ClientProvider from '@/context/ClientContext/clientContext';
import React, { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <ClientProvider>
      <Clients />
      {children}
    </ClientProvider>
  );
}
