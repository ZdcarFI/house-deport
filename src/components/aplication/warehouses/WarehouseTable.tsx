'use client'

import { WarehouseDto } from '@/services/Dto/WarehouseDto'
import { Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Chip } from "@nextui-org/react"
import { MoreVertical, Box, Grid } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WarehouseTableProps {
  warehouses: WarehouseDto[]
  onEdit: (warehouse: WarehouseDto) => void
  onDelete: (id: number) => void
}

export default function WarehouseTable({ warehouses, onEdit, onDelete }: WarehouseTableProps) {
  const router = useRouter()

  const handleView = (warehouse: WarehouseDto) => {
    router.push(`/warehouses/${warehouse.id}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {warehouses.map((warehouse) => (
        <div key={warehouse.id}>
          <Card
            key={warehouse.id}
            className="w-full"
            shadow="sm"
            isPressable
            isHoverable
            onPress={() => handleView(warehouse)}
          >
            <CardBody className="p-4">
              {/* Header with status, name and actions */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Chip
                    color={warehouse.status === 'available' ? 'success' : 'warning'}
                    variant="flat"
                    size="sm"
                  >
                    {warehouse.status}
                  </Chip>
                  <Chip
                    className="text-white"
                    style={{ backgroundColor: warehouse.color }}
                  >
                    {warehouse.name}
                  </Chip>
                </div>

                <div onClick={(e) => e.stopPropagation()}>                  
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem onPress={() => handleView(warehouse)}>
                        Ver
                      </DropdownItem>
                      <DropdownItem onPress={() => onEdit(warehouse)}>
                        Editar
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        color="danger"
                        onPress={() => onDelete(warehouse.id)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-default-400" />
                  <div className="flex gap-2">
                    <span className="text-default-400">Spaces:</span>
                    <span className="font-medium">
                      {warehouse.spacesUsed} / {warehouse.spaces}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-default-400" />
                  <div className="flex gap-2">
                    <span className="text-default-400">Grid:</span>
                    <span className="font-medium">
                      {warehouse.rowMax} × {warehouse.columnMax}
                    </span>
                  </div>
                </div>

                {warehouse.description && (
                  <p className="text-small text-default-400 mt-2 line-clamp-2">
                    {warehouse.description}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  )
}