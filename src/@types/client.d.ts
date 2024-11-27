import { CreateClientDto } from "@/services/Client/dto/CreateClientDto";
import { UpdateClientDto } from "@/services/Client/dto/UpdateClientDto";
import { ClientDto } from "@/services/Dto/ClienDto";

export type ClientContextType = {
    clients: ClientDto[]; // Changed from Product[] to ClientDto[]
    createClient: (client: CreateClientDto) => Promise<void>;
    updateClient: (id: number, client: UpdateClientDto) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;
    getClients: () => Promise<void>;
    getClient: (id: number) => Promise<ClientDto>;
    loading: boolean;
    errorClient: string;
    error: string;
    client: ClientDto;
    isModalOpen: boolean;
    selectedClient: ClientDto | null;
    isViewMode: boolean;
    openModal: (client: ClientDto | null, viewMode: boolean) => void;
    closeModal: () => void;
};