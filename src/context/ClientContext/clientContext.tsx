"use client"
import React from 'react';
import {ClientService} from "@/services/Client/ClientService";
import {CreateClientDto} from "@/services/Client/dto/CreateClientDto";
import {AxiosError} from "axios";
import {UpdateClientDto} from "@/services/Client/dto/UpdateClientDto";
import { ClientActionType, ClientState, clientReducer} from './clientReducer';
import { ClientDto } from '@/services/Dto/ClienDto';
import { ClientContextType } from '@/@types/client';

export const ClientContext = React.createContext<ClientContextType | null>(null);

const clientService = new ClientService();

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, dispatch] = React.useReducer(clientReducer, {clients: []} as ClientState);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
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
            dispatch({type: ClientActionType.LOAD_CLIENTS, payload: clients});
        } catch (e) {
            handleError(e);
        }
    };

    const createClient = async (client: CreateClientDto): Promise<ClientDto> => {
        try {
            const res = await clientService.create(client);
            dispatch({ type: ClientActionType.ADD_CLIENT, payload: res });
            return res;
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const updateClient = async (id: number, client: UpdateClientDto): Promise<void> => {
        try {
            const res = await clientService.updateById(id, client);
            dispatch({type: ClientActionType.EDIT_CLIENT, payload: res});
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
            dispatch({type: ClientActionType.REMOVE_CLIENT, payload: id});
        } catch (e) {
            handleError(e);
        }
    };

    const values = React.useMemo(() => ({
        clients: state.clients,
        createClient,
        updateClient,
        deleteClient,
        getClients,
        loading,
        getClient,
        error
    }), [state.clients, loading, error]);

    return (
        <ClientContext.Provider value={values}>
            {children}
        </ClientContext.Provider>
    );
};

export default ClientProvider;
