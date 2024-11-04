'use client'

import React, { useContext, useState, useEffect } from 'react';
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { OrderDto } from "@/services/Dto/OrderDto";
import { CreateOrderDto } from "@/services/Order/dto/CreateOrderDto";
import { UpdateOrderDto } from "@/services/Order/dto/UpdateOrderDto";
import OrderTable from "@/components/aplication/orders/OrderTable";
import OrderModal from "@/components/aplication/orders/OrderModal";
import { OrderContext } from '@/context/OrderContext/orderContext';
import { ShoppingCartIcon } from 'lucide-react';


export default function Orders() {
  const { 
    orders, 
    loading, 
    error, 
    createOrder, 
    updateOrder, 
    deleteOrder,
    getOrders 
  } = useContext(OrderContext)!;

  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getOrders();
  }, []);

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => 
      order.numFac.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (order: OrderDto) => {
    setSelectedOrder(order);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (order: OrderDto) => {
    setSelectedOrder(order);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id);
    }
  };

  const handleSubmit = async (formData: CreateOrderDto | UpdateOrderDto) => {
    try {
      if (selectedOrder) {
        await updateOrder(selectedOrder.id, formData as UpdateOrderDto);
      } else {
        await createOrder(formData as CreateOrderDto);
      }
      setIsModalOpen(false);
      getOrders(); // Refresh the order list
    } catch (error) {
      console.error("Error submitting order data:", error);
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
          <ShoppingCartIcon />
          <span>Orders</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">All Orders</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            className="w-full md:w-72"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Add Order</Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <OrderTable
            orders={filteredOrders}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
          <OrderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            order={selectedOrder}
            isViewMode={isViewMode}
          />
        </div>
      </div>
    </div>
  );
}