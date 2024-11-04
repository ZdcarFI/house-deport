import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table'
import { UserDto } from '@/services/Dto/UserDto'
import { Tooltip } from '@nextui-org/tooltip'
import { EditIcon } from '../../icons/table/edit-icon'
import { DeleteIcon } from '../../icons/table/delete-icon'
import { EyeIcon } from '../../icons/table/eye-icon'

interface UserTableProps {
  users: UserDto[]
  onView: (user: UserDto) => void
  onEdit: (user: UserDto) => void
  onDelete: (id: number) => void
}

export default function UserTable({ users, onEdit, onDelete, onView }: UserTableProps) {
  const renderCell = (user: UserDto, columnKey: React.Key) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-4 ">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(user)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit user" color="secondary">
              <button onClick={() => onEdit(user)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete user" color="danger">
              <button onClick={() => onDelete(user.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        )
      default:
        return user[columnKey as keyof UserDto]
    }
  }

  return (
    <Table aria-label="Users table">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Username</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{renderCell(user, 'actions')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}