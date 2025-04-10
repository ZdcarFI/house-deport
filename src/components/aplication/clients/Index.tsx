'use client';

import React, {useContext} from 'react';
import {Button, Input} from '@nextui-org/react';
import Link from 'next/link';
import {ExportIcon} from '@/components/icons/accounts/export-icon';
import {HouseIcon} from '@/components/icons/breadcrumb/house-icon';
import {UsersIcon} from '@/components/icons/breadcrumb/users-icon';
import ClientTable from '@/components/aplication/clients/ClientTable';
import ClientModal from '@/components/aplication/clients/ClientModal';
import {ClientDto} from '@/services/Dto/ClienDto';
import {ClientContext} from '@/context/ClientContext/clientContext';
import ConfirmDialog from '@/components/modal/ConfirmDialog';
import {ToastContext} from '@/context/ToastContext/ToastContext';
import {ToastType} from '@/components/Toast/Toast';
import {SearchIcon} from 'lucide-react';
export default function ClientsPage() {
    const {
        clients,
        loading,
        error,
        deleteClient,
        openModal,
    } = useContext(ClientContext)!;

    const {showToast} = useContext(ToastContext)!;


    const [searchQuery, setSearchQuery] = React.useState('');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [selectedClientId, setSelectedClientId] = React.useState<number | null>(null);

    const filteredClients = React.useMemo(() => {
        return clients.filter(client =>
            `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [clients, searchQuery]);

    const handleAdd = () => {
        openModal(null, false);
    };

    const handleView = (client: ClientDto) => {
        openModal(client, true);
    };

    const handleEdit = (client: ClientDto) => {
        openModal(client, false);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteClient(id);
            showToast('Cliente eliminado exitosamente', ToastType.SUCCESS);
            setIsConfirmDialogOpen(false);
        } catch (error) {
            showToast('Error:' + error, ToastType.ERROR);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>;
    }

    if (error) {
        showToast('Error: ' + error, ToastType.ERROR);
        return null;
    }

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon/>
                    <Link href="/">
                        <span>Inicio</span>
                    </Link>
                    <span> / </span>
                </li>
                <li className="flex gap-2">
                    <UsersIcon/>
                    <span>Clientes</span>
                    <span> / </span>
                </li>
                <li className="flex gap-2">
                    <span>Lista</span>
                </li>
            </ul>

            <h3 className="text-xl font-semibold">Todos los clientes</h3>

            <div className="flex justify-between flex-wrap gap-4 items-center">
                <Input
                    className="w-full sm:max-w-[300px]"
                    placeholder="Buscar clientes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<SearchIcon className="text-default-400" size={20}/>}
                />
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Button color="primary" onPress={handleAdd}>
                        Agregar Cliente
                    </Button>
                 
                </div>
            </div>

            <div className="w-full flex flex-col gap-4">
                <ClientTable
                    clients={filteredClients}
                    onEdit={handleEdit}
                    onDelete={(clientId: number) => {
                        setSelectedClientId(clientId);
                        setIsConfirmDialogOpen(true);
                    }}
                    onView={handleView}
                />
                <ClientModal
                    showToast={showToast}/>
                <ConfirmDialog
                    title="¿Estás seguro de que deseas eliminar este cliente?"
                    isOpen={isConfirmDialogOpen}
                    onConfirm={() => {
                        if (selectedClientId) {
                            handleDelete(selectedClientId);
                        }
                    }}
                    onClose={() => {
                        setIsConfirmDialogOpen(false);
                        setSelectedClientId(null);
                    }}
                    onCancel={() => {
                        setIsConfirmDialogOpen(false);
                        setSelectedClientId(null);
                    }}
                />
            </div>
        </div>
    );
}