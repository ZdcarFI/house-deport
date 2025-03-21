import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/table'
import {OrderDto} from '@/services/Dto/OrderDto'
import {Tooltip} from '@nextui-org/tooltip'
import {EditIcon} from '../../icons/table/edit-icon'
import {EyeIcon} from '../../icons/table/eye-icon'
import {Chip} from "@nextui-org/chip"
import React from "react";
import {FilePdf} from "@/components/icons/file-pdf";
import {DeleteIcon} from "lucide-react";

interface OrderTableProps {
    orders: OrderDto[]
    onView: (order: OrderDto) => void
    onEdit: (order: OrderDto) => void
    onDelete: (id: number) => void
    onViewPdf: (id: number) => void
}

export default function OrderTable({orders, onEdit, onView, onViewPdf, onDelete}: OrderTableProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return "warning"
            case 'completed':
                return "success"
            case 'canceled':
                return "danger"
            default:
                return "default"
        }
    }

    const renderCell = (order: OrderDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'numFac':
                return order.numFac
            case 'client':
                return order.client ? `${order.client.firstName} ${order.client.lastName}` : 'N/A'
            case 'user':
                return order.user ? order.user.username : 'N/A'
            case 'date':
                return order.date ? new Date(order.date).toLocaleDateString() : 'N/A'
            case 'discount':
                return order.discount ? `S/.${order.discount.toFixed(2)}` : 'S/.0.00'
            case 'total':
                return order.total ? `S/.${order.total.toFixed(2)}` : 'S/.0.00'
            case 'status':
                return order.status ? (
                    <Chip
                        color={getStatusColor(order.status)}
                        variant="flat"
                        size="sm"
                        className="capitalize"
                    >
                        {order.status}
                    </Chip>
                ) : 'N/A'
            case 'actions':
                return (
                    <div className="flex items-center gap-4">
                        <Tooltip content="Detalle" color="primary">
                            <button onClick={() => onView(order)}>
                                <EyeIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Editar order" color="secondary">
                            <button onClick={() => onEdit(order)}>
                                <EditIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Eliminar orden" color="danger">
                            <button onClick={() => onDelete(order.id)}>
                                <DeleteIcon size={20} fill="#FF0080"/>
                            </button>
                        </Tooltip>
                        <Tooltip content="Ver pdf" color="danger">
                            <button onClick={() => onViewPdf(order.id)}>
                                <FilePdf size={20} color="#FF0080"/>
                            </button>
                        </Tooltip>
                    </div>
                )
            default:
                return 'N/A'
        }
    }

    return (
        <Table aria-label="Orders table">
            <TableHeader>
                <TableColumn>Numero de factura</TableColumn>
                <TableColumn>Cliente</TableColumn>
                <TableColumn>Usuario</TableColumn>
                <TableColumn>Fecha</TableColumn>
                <TableColumn>Descuento</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Fecha de creación</TableColumn>
                <TableColumn>Fecha de actualización</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>{renderCell(order, 'numFac')}</TableCell>
                        <TableCell>{renderCell(order, 'client')}</TableCell>
                        <TableCell>{renderCell(order, 'user')}</TableCell>
                        <TableCell>{renderCell(order, 'date')}</TableCell>
                        <TableCell>{renderCell(order, 'discount')}</TableCell>
                        <TableCell>{renderCell(order, 'total')}</TableCell>
                        <TableCell>{renderCell(order, 'status')}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(order.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell>{renderCell(order, 'actions')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}