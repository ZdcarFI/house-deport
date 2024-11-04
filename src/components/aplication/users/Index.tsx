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
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
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
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Users</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">All Users</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            className="w-full md:w-72"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Add User</Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          user={selectedUser}
          isViewMode={isViewMode}
        />
      </div>
      </div>
    </div>
  )
}