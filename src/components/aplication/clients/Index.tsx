"use client";

import React from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import ClientTable from "@/components/aplication/clients/ClientTable";
import ClientModal from "@/components/aplication/clients/ClientModal";
import { ClientDto } from "@/services/Dto/ClienDto";
import { ClientContext } from "@/context/ClientContext/clientContext";

export default function Clients() {
  const {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient
  } = React.useContext(ClientContext)!;

  const [selectedClient, setSelectedClient] = React.useState<ClientDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewMode, setIsViewMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredClients = React.useMemo(() => {
    return clients.filter(client => 
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  const handleAdd = () => {
    setSelectedClient(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (client: ClientDto) => {
    setSelectedClient(client);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (client: ClientDto) => {
    setSelectedClient(client);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      await deleteClient(id);
    }
  };

  const handleSubmit = async (formData: ClientDto) => {
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id, formData);
      } else {
        await createClient(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting client data:", error);
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
          <Link href="/">
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <UsersIcon />
          <span>Clients</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Clients</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            className="w-full md:w-72"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>
            Add Client
          </Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <ClientTable
          clients={filteredClients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          client={selectedClient}
          isViewMode={isViewMode}
        />
      </div>
    </div>
  );
}