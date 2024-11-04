import Products from '@/components/aplication/products/Index';
import ProductProvider from '@/context/ProductContext/productContext';
import React, { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <ProductProvider>
      <Products />
      {children}
    </ProductProvider>
  );
}
