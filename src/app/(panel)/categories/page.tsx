import Categories from '@/components/aplication/categories/Index';
import CategoryProvider from '@/context/CategoryContext/categoryContext';
import React, { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <CategoryProvider>
      <Categories />
      {children}
    </CategoryProvider>
  );
}
