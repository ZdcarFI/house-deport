import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/table'
import {UserDto} from '@/services/Dto/UserDto'
import {Tooltip} from '@nextui-org/tooltip'
import {EditIcon} from '../../icons/table/edit-icon'
import {DeleteIcon} from '../../icons/table/delete-icon'
import {EyeIcon} from '../../icons/table/eye-icon'
import {Chip} from '@nextui-org/chip'
import React from "react";

interface UserTableProps {
    users: UserDto[]
    onView: (user: UserDto) => void
    onEdit: (user: UserDto) => void
    onDelete: (id: number) => void
}

export default function UserTable({users, onEdit, onDelete, onView}: UserTableProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'warning'
            case 'completed':
                return 'success'
            case 'canceled':
                return 'danger'
            default:
                return 'default'
        }
    }

    const renderCell = (user: UserDto, columnKey: string) => {
        switch (columnKey) {
            case 'fullName':
                return `${user.firstName} ${user.lastName}`
            case 'username':
                return user.username
            case 'email':
                return user.email
            case 'status':
                return (
                    <Chip
                        // color={getStatusColor(user.status)}
                        color={getStatusColor('completed')}
                        variant="flat"
                        size="sm"
                        className="capitalize"
                    >
                        {/* {user.status} */}
                        Activo
                    </Chip>
                )
            case 'rol':
                return user.role
            case 'lastSession':
                return user.lastSession ? new Date(user.lastSession).toLocaleDateString() : 'No disponible'
            case 'created_at':
                return new Date(user.created_at).toLocaleDateString()
            case 'updated_at':
                return new Date(user.updated_at).toLocaleDateString()
            case 'actions':
                return (
                    <div className="flex items-center gap-4">
                        <Tooltip content="Detalles" color="primary">
                            <button onClick={() => onView(user)}>
                                <EyeIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Editar usuario" color="secondary">
                            <button onClick={() => onEdit(user)}>
                                <EditIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Eliminar usuario" color="danger">
                            <button onClick={() => onDelete(user.id)}>
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
        <Table aria-label="Users table">
            <TableHeader>
                <TableColumn key="fullName">Nombre completo</TableColumn>
                <TableColumn key="username">Nombre de usuario</TableColumn>
                <TableColumn key="email">Correo</TableColumn>
                <TableColumn key="status">Estado</TableColumn>
                <TableColumn key="status">Rol</TableColumn>
                <TableColumn key="lastSession">Última sesión</TableColumn>
                <TableColumn>Fecha de creación</TableColumn>
                <TableColumn>Fecha de actualización</TableColumn>
                <TableColumn key="actions">Acciones</TableColumn>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{renderCell(user, 'fullName')}</TableCell>
                        <TableCell>{renderCell(user, 'username')}</TableCell>
                        <TableCell>{renderCell(user, 'email')}</TableCell>
                        <TableCell>{renderCell(user, 'status')}</TableCell>
                        <TableCell>{renderCell(user, 'rol')}</TableCell>
                        <TableCell>{renderCell(user, 'lastSession')}</TableCell>
                        <TableCell>{renderCell(user, 'created_at')}</TableCell>
                        <TableCell>{renderCell(user, 'updated_at')}</TableCell>
                        <TableCell>{renderCell(user, 'actions')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
