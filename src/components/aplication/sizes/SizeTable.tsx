import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table'
import { SizeDto } from '@/services/Dto/SizeDto'
import { Tooltip } from '@nextui-org/tooltip'
import { EditIcon } from '../../icons/table/edit-icon'
import { DeleteIcon } from '../../icons/table/delete-icon'
import { EyeIcon } from '../../icons/table/eye-icon'
import { CategoryDto } from '@/services/Dto/CategoryDto'

interface SizeTableProps {
  sizes: SizeDto[]
  onView: (size: SizeDto) => void
  onEdit: (size: SizeDto) => void
  onDelete: (id: number) => void
  categories: CategoryDto[]
}

export default function SizeTable({ sizes, onEdit, onDelete, onView }: SizeTableProps) {
  const renderCell = (size: SizeDto, columnKey: React.Key) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-4 ">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(size)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit size" color="secondary">
              <button onClick={() => onEdit(size)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete size" color="danger">
              <button onClick={() => onDelete(size.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        )
      default:
        return size[columnKey as keyof SizeDto]
    }
  }

  return (
    <Table aria-label="Sizes table">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {sizes.map((size) => (
          <TableRow key={size.id}>
            <TableCell>{size.name}</TableCell>
            <TableCell>{renderCell(size, 'actions')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}