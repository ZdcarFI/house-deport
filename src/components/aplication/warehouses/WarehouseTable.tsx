import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table'
import { WarehouseDto } from '@/services/Dto/WarehouseDto'
import { Tooltip } from '@nextui-org/tooltip'
import { EditIcon } from '../../icons/table/edit-icon'
import { DeleteIcon } from '../../icons/table/delete-icon'
import { EyeIcon } from '../../icons/table/eye-icon'

interface WarehouseTableProps {
  warehouses: WarehouseDto[]
  onView: (warehouse: WarehouseDto) => void
  onEdit: (warehouse: WarehouseDto) => void
  onDelete: (id: number) => void
}

export default function WarehouseTable({ warehouses, onEdit, onDelete, onView }: WarehouseTableProps) {
  const renderCell = (warehouse: WarehouseDto, columnKey: React.Key) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-4 ">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(warehouse)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit warehouse" color="secondary">
              <button onClick={() => onEdit(warehouse)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete warehouse" color="danger">
              <button onClick={() => onDelete(warehouse.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        )
      default:
        return warehouse[columnKey as keyof WarehouseDto]
    }
  }

  return (
    <Table aria-label="Warehouses table">
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>Filas máximas</TableColumn>
        <TableColumn>Columnas máximas</TableColumn>
        <TableColumn>Estado</TableColumn>
        <TableColumn>Acciones</TableColumn>
      </TableHeader>
      <TableBody>
        {warehouses.map((warehouse) => (
          <TableRow key={warehouse.id}>
            <TableCell>{warehouse.name}</TableCell>
            <TableCell>{warehouse.rowMax}</TableCell>
            <TableCell>{warehouse.columnMax}</TableCell>
            <TableCell>{warehouse.status}</TableCell>
            <TableCell>{renderCell(warehouse, 'actions')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}