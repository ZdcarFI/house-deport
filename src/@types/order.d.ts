import { OrderDto } from "@/services/Dto/OrderDto";
import { CreateOrderDto } from "@/services/Order/dto/CreateOrderDto";
import { UpdateOrderDto } from "@/services/Order/dto/UpdateOrderDto";

export type OrderContextType = {
    orders: OrderDto[];
    createOrder: (Order: CreateOrderDto) => Promise<void>;
    updateOrder: (id:number, Order: UpdateOrderDto) => Promise<void>;
    deleteOrder: (id: number) => Promise<void>;
    getOrders: () => Promise<void>;
    getOrder: (id: number) => Promise<OrderDto>;
    loading: boolean;
    error: string;
};