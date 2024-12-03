"use client";

import React from "react";
import {Button, Input} from "@nextui-org/react";
import Link from "next/link";
import {ExportIcon} from "@/components/icons/accounts/export-icon";
import {HouseIcon} from "@/components/icons/breadcrumb/house-icon";
import {OrderDto} from "@/services/Dto/OrderDto";
import {CreateOrderDto} from "@/services/Order/dto/CreateOrderDto";
import {UpdateOrderDto} from "@/services/Order/dto/UpdateOrderDto";
import {OrderContext} from "@/context/OrderContext/orderContext";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { ShoppingCartIcon } from "lucide-react";
import OrderTable from "./OrderTable";
import OrderModal from "./OrderModal";
import {useRouter} from "next/navigation";

export default function Orders() {
  const { orders, loading, errorOrder, createOrder, updateOrder, deleteOrder, getOrder } = React.useContext(OrderContext)!;
  const [selectedOrder, setSelectedOrder] = React.useState<OrderDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewMode, setIsViewMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const router = useRouter()

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => 
      order.numFac?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.client?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (order.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [orders, searchQuery]);

  const handleView = async (order: OrderDto) => {
    try {
      const fullOrder = await getOrder(order.id);
      setSelectedOrder(fullOrder);
      setIsViewMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleEdit = async (order: OrderDto) => {
    try {
      const fullOrder = await getOrder(order.id);
      setSelectedOrder(fullOrder);
      setIsViewMode(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteOrder(id);
    setTitle("");
    setIsConfirmDialogOpen(false);
  };

  const handleSubmit = async (formData: CreateOrderDto | UpdateOrderDto) => {
    try {
      if (selectedOrder) {
        await updateOrder(selectedOrder.id, formData as UpdateOrderDto);
      } else {
        await createOrder(formData as CreateOrderDto);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting order data:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (errorOrder) {
    return <div className="text-red-500 text-center">{errorOrder}</div>;
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon/>
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <ShoppingCartIcon/>
          <span>Ventas</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Lista</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Todas las ventas</h3>
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
          <Button color="primary" onPress={()=> router.push("/createOrder")}>Agregar venta</Button>
          <Button color="primary" startContent={<ExportIcon/>}>
            Exportar a CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <OrderTable
            orders={filteredOrders}
            onEdit={handleEdit}
            onDelete={(orderId: number)=>{
              const selectedOrder = orders.find(order => order.id === orderId);
              setSelectedOrder(selectedOrder || null);
              setIsConfirmDialogOpen(true);
              setTitle("Are you sure you want to delete this order?");
            }}
            onView={handleView}
          />
          <OrderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            order={selectedOrder}
            isViewMode={isViewMode}
          />
          <ConfirmDialog
            title={title}
            isOpen={isConfirmDialogOpen}
            onConfirm={() => {
              if (selectedOrder) {
                handleDelete(selectedOrder.id);
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