import { CreateOrderDto } from "@/services/Order/dto/CreateOrderDto";
import { UpdateOrderDto } from "@/services/Order/dto/UpdateOrderDto";
import { OrderDto } from "@/services/Dto/ClienDto";

export type OrderContextType = {
    orders: Product[];
    createOrder: (Order: CreateOrderDto) => Promise<void>;
    updateOrder: (id:number, Order: UpdateOrderDto) => Promise<void>;
    deleteOrder: (id: number) => Promise<void>;
    getOrders: () => Promise<void>;
    getOrder: (id: number) => Promise<OrderDto>;
    loading: boolean;
    error: string;
};