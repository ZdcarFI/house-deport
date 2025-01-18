"use client";

import React, { useContext } from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { UserDto } from "@/services/Dto/UserDto";
import UserTable from "@/components/aplication/users/UserTable";
import UserModal from "@/components/aplication/users/UserModal";

import { UserContext } from "@/context/UserContext/userContext";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { SearchIcon } from "lucide-react";
import { ToastType } from "@/components/Toast/Toast";
import { ToastContext } from "@/context/ToastContext/ToastContext";

export default function Users() {
    const {
        users,
        loading,
        error,
        deleteUser,
        openModal
    } = React.useContext(UserContext)!;
    const { showToast } = useContext(ToastContext)!;

    const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);

    const [searchQuery, setSearchQuery] = React.useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

    const filteredUsers = React.useMemo(() => {
        return users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handleAdd = () => {
        openModal(null, false);
    };

    const handleView = (user: UserDto) => {
        openModal(user, true);
    };

    const handleEdit = (user: UserDto) => {
        openModal(user, false);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            showToast("Usuario eliminado exitosamente", ToastType.SUCCESS);
            setIsConfirmDialogOpen(false);
        }
        catch (error) {
            showToast("Error:" + error, ToastType.ERROR);
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

                </div>

                <div className="w-full flex flex-col gap-4">
                    <UserTable
                        users={filteredUsers}
                        onEdit={handleEdit}
                        onDelete={(userId: number) => {
                            setSelectedUserId(userId);
                            setIsConfirmDialogOpen(true);
                        }}
                        onView={handleView}
                    />
                    <UserModal
                        showToast={showToast} />
                    <ConfirmDialog
                        title="¿Estás seguro de que deseas eliminar este usuario?"
                        isOpen={isConfirmDialogOpen}
                        onConfirm={() => {
                            if (selectedUserId) {
                                handleDelete(selectedUserId);
                            }
                        }}
                        onClose={() => {
                            setIsConfirmDialogOpen(false);
                            setSelectedUserId(null);
                        }}
                        onCancel={() => {
                            setIsConfirmDialogOpen(false);
                            setSelectedUserId(null);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}