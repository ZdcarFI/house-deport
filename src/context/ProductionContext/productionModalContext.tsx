"use client"

import {ProductionDto} from '@/services/Dto/ProductionDto';
import React, {createContext, useState, useContext, ReactNode} from 'react';

interface ModalContextType {
    isOpen: boolean;
    openModal: (production?: ProductionDto | null) => void;
    closeModal: () => void;
    selectedProduction: ProductionDto | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduction, setSelectedProduction] = useState<ProductionDto | null>(null);

    const openModal = (production: ProductionDto | null = null) => {
        setSelectedProduction(production);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedProduction(null);
    };

    return (
        <ModalContext.Provider value={{isOpen, openModal, closeModal, selectedProduction}}>
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

