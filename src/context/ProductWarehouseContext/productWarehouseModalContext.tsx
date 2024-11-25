"use client"

import { ProductWarehouseDto } from '@/services/Dto/ProductWarehouseDto';
import { ProductDto } from '@/services/Dto/ProductDto';
import { WarehouseDto } from '@/services/Dto/WarehouseDto';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
    isOpen: boolean;
    openModal: (productWarehouse?: ProductWarehouseDto | null, initialData?: ProductDto | WarehouseDto | null) => void;
    closeModal: () => void;
    selectedProductWarehouse: ProductWarehouseDto | null;
    initialData: ProductDto | WarehouseDto | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProductWarehouse, setSelectedProductWarehouse] = useState<ProductWarehouseDto | null>(null);
    const [initialData, setInitialData] = useState<ProductDto | WarehouseDto | null>(null);

    const openModal = (productWarehouse: ProductWarehouseDto | null = null, data: ProductDto | WarehouseDto | null = null) => {
        setSelectedProductWarehouse(productWarehouse);
        setInitialData(data);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedProductWarehouse(null);
        setInitialData(null);
    };

    return (
        <ModalContext.Provider value={{ 
            isOpen, 
            openModal, 
            closeModal, 
            selectedProductWarehouse, 
            initialData 
        }}>
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

