"use client"

import React, { createContext, useReducer, useState, useMemo, useEffect, useCallback } from "react";
import { ClientService } from "@/services/Client/ClientService";
import { ClientActionType, ClientState, clientReducer } from "./clientReducer";
import { ClientContextType } from "@/@types/client";
import { AxiosError } from "axios";
import { CreateClientDto } from "@/services/Client/dto/CreateClientDto";
import { UpdateClientDto } from "@/services/Client/dto/UpdateClientDto";
import { ClientDto } from "@/services/Dto/ClienDto";

export const ClientContext = createContext<ClientContextType | null>(null);

const clientService = new ClientService();
const clientInitialState: ClientDto = {
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    numberDocument: '',
    typeDocument: '',
    createdAt:''
};

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(clientReducer, { clients: [] } as ClientState);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                await getClients();
            } catch (e) {
                console.error("Error loading clients:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const getClients = async (): Promise<void> => {
        try {
            const clients = await clientService.getAll();
            dispatch({ type: ClientActionType.LOAD_CLIENTS, payload: clients });
        } catch (e) {
            handleError(e);
        }
    };

    const createClient = async (client: CreateClientDto): Promise<void> => {
        try {
            const res = await clientService.create(client);
            dispatch({ type: ClientActionType.ADD_CLIENT, payload: res });
            setSelectedClient(clientInitialState);
        } catch (e) {
            handleError(e);
        }
    };

    const updateClient = async (id: number, client: UpdateClientDto): Promise<void> => {
        try {
            const res = await clientService.updateById(id, client);
            dispatch({ type: ClientActionType.EDIT_CLIENT, payload: res });
            setSelectedClient(clientInitialState);
        } catch (e) {
            handleError(e);
        }
    };

    const getClient = async (id: number): Promise<ClientDto> => {
        try {
            return await clientService.getById(id);
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const deleteClient = async (id: number): Promise<void> => {
        try {
            await clientService.deleteById(id);
            dispatch({ type: ClientActionType.REMOVE_CLIENT, payload: id });
        } catch (e) {
            handleError(e);
        }
    };

    const openModal = useCallback((client: ClientDto | null = null, viewMode: boolean = false) => {
        setSelectedClient(client);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const values = useMemo(() => ({
        clients: state.clients,
        createClient,
        updateClient,
        deleteClient,
        getClients,
        loading,
        getClient,
        error,
        errorClient: error,
        client: clientInitialState,
        isModalOpen,
        selectedClient,
        isViewMode,
        openModal,
        closeModal,
    }), [state.clients, loading, error, isModalOpen, selectedClient, isViewMode, openModal, closeModal]);

    return (
        <ClientContext.Provider value={values}>
            {children}
        </ClientContext.Provider>
    );
};

export default ClientProvider;

