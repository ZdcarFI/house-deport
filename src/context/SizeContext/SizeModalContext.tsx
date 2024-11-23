"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SizeDto } from '@/services/Dto/SizeDto';

interface ModalContextType {
    isOpen: boolean;
    openModal: (size?: SizeDto | null) => void;
    closeModal: () => void;
    selectedSize: SizeDto | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<SizeDto | null>(null);

    const openModal = (size: SizeDto | null = null) => {
        setSelectedSize(size);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedSize(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, selectedSize }}>
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

