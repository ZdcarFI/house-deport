"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProductDto } from '@/services/Dto/ProductDto';

interface ModalContextType {
    isOpen: boolean;
    openModal: (Product?: ProductDto | null) => void;
    closeModal: () => void;
    selectedProduct: ProductDto | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);

    const openModal = (Product: ProductDto | null = null) => {
        setSelectedProduct(Product);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedProduct(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, selectedProduct }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

