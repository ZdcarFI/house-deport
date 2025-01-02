'use client'

import {WarehouseDto} from '@/services/Dto/WarehouseDto'
import {Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Chip} from "@nextui-org/react"
import {MoreVertical, Box, Grid} from 'lucide-react'
import Link from "next/link";

interface WarehouseTableProps {
    warehouses: WarehouseDto[],
    onView: (warehouse: WarehouseDto) => void
    onEdit: (warehouse: WarehouseDto) => void
    onDelete: (id: number) => void
}

export default function WarehouseTable({warehouses, onView, onEdit, onDelete}: WarehouseTableProps) {


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((warehouse) => (
                <div key={warehouse.id}>
                    <Link href={`/warehouses/${warehouse.id}`}>
                        <Card
                            key={warehouse.id}
                            className="w-full"
                            shadow="sm"
                            isPressable
                            isHoverable

                        >
                            <CardBody className="p-4 relative">
                                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                    <div
                                        className="flex-grow bg-gray-200 text-white p-2 rounded-md"
                                        style={{
                                            backgroundColor: warehouse.color,
                                            textAlign: "left",
                                        }}
                                    >
                                        {warehouse.name}
                                    </div>

                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                            >
                                                <MoreVertical className="h-4 w-4"/>
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            <DropdownItem onPress={() => onView(warehouse)}>
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


                                <div className="border-t border-gray-200 my-3"></div>


                                {warehouse.description && (
                                    <p className="text-small text-default-400 mb-4 line-clamp-2">
                                        {warehouse.description}
                                    </p>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Box className="h-4 w-4 text-default-400"/>
                                        <div className="flex gap-2">
                                            <span className="text-default-400">Spaces:</span>
                                            <span className="font-medium">
                      {warehouse.spacesUsed} / {warehouse.spaces}
                    </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Grid className="h-4 w-4 text-default-400"/>
                                        <div className="flex gap-2">
                                            <span className="text-default-400">Grid:</span>
                                            <span className="font-medium">
                      {warehouse.rowMax} × {warehouse.columnMax}
                    </span>
                                        </div>
                                    </div>
                                </div>

                                <Chip
                                    color={warehouse.status === 'available' ? 'success' : 'warning'}
                                    variant="flat"
                                    size="sm"
                                    className="absolute bottom-4 right-4"
                                >
                                    {warehouse.status}
                                </Chip>
                            </CardBody>
                        </Card>
                    </Link>
                </div>
            ))}
        </div>
    )
}
