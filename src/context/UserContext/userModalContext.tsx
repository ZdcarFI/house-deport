"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserDto } from '@/services/Dto/UserDto';

interface ModalContextType {
    isOpen: boolean;
    openModal: (user?: UserDto | null) => void;
    closeModal: () => void;
    selectedUser: UserDto | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

    const openModal = (user: UserDto | null = null) => {
        setSelectedUser(user);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedUser(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, selectedUser }}>
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

