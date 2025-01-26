"use client";

import React, {useContext} from "react";
import {Button, Input} from "@nextui-org/react";
import Link from "next/link";
import {HouseIcon} from "@/components/icons/breadcrumb/house-icon";
import {OrderDto} from "@/services/Dto/OrderDto";
import {CreateOrderDto} from "@/services/Order/dto/CreateOrderDto";
import {UpdateOrderDto} from "@/services/Order/dto/UpdateOrderDto";
import {OrderContext} from "@/context/OrderContext/orderContext";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {ShoppingCartIcon} from "lucide-react";
import OrderTable from "./OrderTable";
import OrderModal from "./OrderModal";
import {useRouter} from "next/navigation";
import {ToastType} from "@/components/Toast/Toast";
import {ToastContext} from "@/context/ToastContext/ToastContext";
import ExportToExcelOrders from "@/components/aplication/orders/ExportExcelOrders";
import {ProductContext} from "@/context/ProductContext/productContext";

export default function Orders() {
    const {
        orders,
        loading,
        errorOrder,
        createOrder,
        updateOrder,
        deleteOrder,
        getOrder
    } = React.useContext(OrderContext)!;
    const {getProducts} = React.useContext(ProductContext)!;
    const [selectedOrder, setSelectedOrder] = React.useState<OrderDto | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isViewMode, setIsViewMode] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const router = useRouter()
    const {showToast} = useContext(ToastContext)!;

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
            return showToast('Error: ' + error, ToastType.ERROR);
        }
    };

    const handleEdit = async (order: OrderDto) => {
        try {
            const fullOrder = await getOrder(order.id);
            setSelectedOrder(fullOrder);
            setIsViewMode(false);
            setIsModalOpen(true);
        } catch (error) {
            return showToast('Error: ' + error, ToastType.ERROR);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteOrder(id);
            showToast('Orden eliminado exitosamente', ToastType.SUCCESS);
            setTitle("");
            setIsConfirmDialogOpen(false);

        } catch (error) {
            showToast('Error:' + error, ToastType.ERROR);
        }
    };

    const handleSubmit = async (formData: CreateOrderDto | UpdateOrderDto) => {
        try {
            if (selectedOrder) {
                await updateOrder(selectedOrder.id, formData as UpdateOrderDto);
                await getProducts()
            } else {
                await createOrder(formData as CreateOrderDto);
            }
            setIsModalOpen(false);
        } catch (error) {
            return showToast('Error: ' + error, ToastType.ERROR);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>;
    }

    if (errorOrder) {
        showToast('Error: ' + errorOrder, ToastType.ERROR);
        return null
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
                    <Button color="primary" onPress={() => router.push("/createOrder")}>Agregar venta</Button>
                    <ExportToExcelOrders orders={orders}/>

                </div>
                <div className="w-full flex flex-col gap-4">
                    <OrderTable
                        orders={filteredOrders}
                        onEdit={handleEdit}
                        onDelete={(orderId: number) => {
                            const selectedOrder = orders.find(order => order.id === orderId);
                            setSelectedOrder(selectedOrder || null);
                            setIsConfirmDialogOpen(true);
                            setTitle("Estas seguro de eliminar la venta, la cantidad de los productos volveran al almacen ?");
                        }}
                        onViewPdf={(orderId: number) => window.open(`/pdf/${orderId}`, '_blank')}
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