"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CategoryDto } from '@/services/Dto/CategoryDto';

interface ModalContextType {
    isOpen: boolean;
    openModal: (category?: CategoryDto | null) => void;
    closeModal: () => void;
    selectedCategory: CategoryDto | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);

    const openModal = (category: CategoryDto | null = null) => {
        setSelectedCategory(category);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedCategory(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, selectedCategory }}>
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

