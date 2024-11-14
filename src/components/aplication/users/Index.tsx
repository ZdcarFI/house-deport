"use client";

import React from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { UserDto } from "@/services/Dto/UserDto";
import UserTable from "@/components/aplication/users/UserTable";
import UserModal from "@/components/aplication/users/UserModal";
import { CreateUserDto } from "@/services/User/dto/CreateUserDto";
import { UpdateUserDto } from "@/services/User/dto/UpdateUserDto";
import { UserContext } from "@/context/UserContext/userContext";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { SearchIcon } from "lucide-react";

export default function Users() {
    const {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser
    } = React.useContext(UserContext)!;

    const [selectedUser, setSelectedUser] = React.useState<UserDto | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isViewMode, setIsViewMode] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

    const filteredUsers = React.useMemo(() => {
        return users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handleAdd = () => {
        setSelectedUser(null);
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const handleView = (user: UserDto) => {
        setSelectedUser(user);
        setIsViewMode(true);
        setIsModalOpen(true);
    };

    const handleEdit = (user: UserDto) => {
        setSelectedUser(user);
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteUser(id);
        setTitle("");
        setIsConfirmDialogOpen(false);
    };

    const handleSubmit = async (formData: CreateUserDto | UpdateUserDto) => {
        try {
            if (selectedUser) {
                await updateUser(selectedUser.id, formData as UpdateUserDto);
            } else {
                await createUser(formData as CreateUserDto);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting user data:", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon />
                    <Link href={"/"}>
                        <span>Inicio</span>
                    </Link>
                    <span>  / </span>{"  "}
                </li>

                <li className="flex gap-2">
                    <UsersIcon />
                    <span>Usuarios</span>
                    <span>  / </span>{"  "}
                </li>
                <li className="flex gap-2">
                    <span>Lista</span>
                </li>
            </ul>
            <h3 className="text-xl font-semibold">Todos los usuarios</h3>

            <div className="flex justify-between flex-wrap gap-4 items-center">
             
                    <Input
                        className="w-full sm:max-w-[300px]"
                        placeholder="Buscar usuarios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        startContent={<SearchIcon className="text-default-400" size={20} />}
                    />
                    <div className="flex gap-3">
                        <Button color="primary" onPress={handleAdd}>
                            Agregar Usuario
                        </Button>
                        <Button color="secondary" startContent={<ExportIcon />}>
                            Export to CSV
                        </Button>
                    </div>
              
                <div className="w-full flex flex-col gap-4">
                    <UserTable
                        users={filteredUsers}
                        onEdit={handleEdit}
                        onDelete={(userId: number) => {
                            const selectedUser = users.find(user => user.id === userId);
                            setSelectedUser(selectedUser);
                            setIsConfirmDialogOpen(true);
                            setTitle("¿Estás seguro de que deseas eliminar este usuario?");
                        }}
                        onView={handleView}
                    />
                    <UserModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        user={selectedUser}
                        isViewMode={isViewMode}
                    />
                    <ConfirmDialog
                        title={title}
                        isOpen={isConfirmDialogOpen}
                        onConfirm={() => {
                            if (selectedUser) {
                                handleDelete(selectedUser.id);
                            }
                        }}
                        onClose={() => {
                            setIsConfirmDialogOpen(false);
                            setTitle("");
                        }}
                        onCancel={() => {
                            setIsConfirmDialogOpen(false);
                            setTitle("");
                        }}
                    />
                </div>
            </div>
        </div>
    )
}