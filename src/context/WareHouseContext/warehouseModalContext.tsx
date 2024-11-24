"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { WarehouseDto } from '@/services/Dto/WarehouseDto';

interface ModalContextType {
    isOpen: boolean;
    openModal: (warehouse?: WarehouseDto | null) => void;
    closeModal: () => void;
    selectedWarehouse: WarehouseDto | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseDto | null>(null);

    const openModal = (warehouse: WarehouseDto | null = null) => {
        setSelectedWarehouse(warehouse);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedWarehouse(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, selectedWarehouse }}>
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

