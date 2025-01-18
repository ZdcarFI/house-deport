"use client"

import { ClientDto } from '@/services/Dto/ClienDto';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
    isOpen: boolean;
    openModal: (client?: ClientDto | null) => void;
    closeModal: () => void;
    selectedClient: ClientDto | null;
}



const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);

    const openModal = (client: ClientDto | null = null) => {
        setSelectedClient(client);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedClient(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, selectedClient }}>
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

