import Sizes from '@/components/aplication/sizes/Index';
import SizeProvider from '@/context/SizeContext/sizeContext';
import React, { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <SizeProvider>
      <Sizes />
      {children}
    </SizeProvider>
  );
}
