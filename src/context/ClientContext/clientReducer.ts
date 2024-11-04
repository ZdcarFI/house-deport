import { ClientDto } from "@/services/Dto/ClienDto";

export interface ClientState {
    clients: ClientDto[];
}

export enum ClientActionType {
    ADD_CLIENT = "addClient",
    REMOVE_CLIENT = "removeClient",
    EDIT_CLIENT = "editClient",
    LOAD_CLIENTS = "loadClients",
}

export type ClientAction =
    | { type: ClientActionType.ADD_CLIENT; payload: ClientDto }
    | { type: ClientActionType.REMOVE_CLIENT; payload: number }
    | { type: ClientActionType.EDIT_CLIENT; payload: ClientDto }
    | { type: ClientActionType.LOAD_CLIENTS; payload: ClientDto[]};

export const clientReducer = (state: ClientState, action: ClientAction): ClientState => {
    switch (action.type) {
        case ClientActionType.ADD_CLIENT:
            return {
                ...state,
                clients: [...state.clients, action.payload],
            };
        case ClientActionType.REMOVE_CLIENT:
            return {
                ...state,
                clients: state.clients.filter(
                    (client) => client.id !== action.payload
                ),
            };
        case ClientActionType.EDIT_CLIENT:
            const updatedClient = action.payload;

            const updatedClients = state.clients.map((client) => {
                if (client.id === updatedClient.id) {
                    return updatedClient;
                }
                return client;
            });

            return {
                ...state,
                clients: updatedClients,
            };
        case ClientActionType.LOAD_CLIENTS:
            return {
                ...state,
                clients: action.payload,
            };
        default:
            return state;
    }
};