import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/table'
import {ClientDto} from '@/services/Dto/ClienDto'
import {Tooltip} from '@nextui-org/tooltip'
import {EditIcon} from '../../icons/table/edit-icon'
import {DeleteIcon} from '../../icons/table/delete-icon'
import {EyeIcon} from '../../icons/table/eye-icon'
import React from "react";


interface ClientTableProps {
    clients: ClientDto[]
    onView: (client: ClientDto) => void
    onEdit: (client: ClientDto) => void
    onDelete: (id: number) => void
}

export default function ClientTable({clients, onEdit, onDelete, onView}: ClientTableProps) {
    const renderCell = (client: ClientDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'actions':
                return (
                    <div className="flex items-center gap-4 ">
                        <Tooltip content="Details" color="primary">
                            <button onClick={() => onView(client)}>
                                <EyeIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Edit user" color="secondary">
                            <button onClick={() => onEdit(client)}>
                                <EditIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Delete user" color="danger">
                            <button onClick={() => onDelete(client.id)}>
                                <DeleteIcon size={20} fill="#FF0080"/>
                            </button>
                        </Tooltip>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <Table aria-label="Clients table">
            <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Tipo Documento</TableColumn>
                <TableColumn>Numero documento</TableColumn>
                <TableColumn>Tipo Contribuyente</TableColumn>
                <TableColumn>Celular</TableColumn>
                <TableColumn>Direccion</TableColumn>
                <TableColumn>Fecha de creación</TableColumn>
                <TableColumn>Fecha de actualización</TableColumn>
                <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
                {clients.map((client) => (
                    <TableRow key={client.id}>
                        <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                        <TableCell>{client.typeDocument}</TableCell>
                        <TableCell>{client.numberDocument}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.address}</TableCell>
                        <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(client.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell>{renderCell(client, 'actions')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}