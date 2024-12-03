"use client"
import {OrderService} from "@/services/Order/OrderService";
import React from "react";
import {OrderActionType, OrderState, orderReducer} from "./orderReducer";
import {OrderContextType} from "@/@types/order";
import {AxiosError} from "axios";
import {CreateOrderDto} from "@/services/Order/dto/CreateOrderDto";
import {UpdateOrderDto} from "@/services/Order/dto/UpdateOrderDto";
import {OrderDto} from "@/services/Dto/OrderDto";

export const OrderContext = React.createContext<OrderContextType | null>(null);
const orderService = new OrderService();
const OrderProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, dispatch] = React.useReducer(orderReducer, {orders: []} as OrderState);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                await getOrders();
            } catch (e) {
                console.error("Error loading orders:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const getOrders = async (): Promise<void> => {
        try {
            const orders = await orderService.getAll();
            dispatch({type: OrderActionType.LOAD_ORDERS, payload: orders});
        } catch (e) {
            handleError(e);
        }
    };

    const createOrder = async (order: CreateOrderDto): Promise<OrderDto> => {
        const res = await orderService.create(order);
        dispatch({type: OrderActionType.ADD_ORDER, payload: res});
        return res;
    };

    const updateOrder = async (id: number, order: UpdateOrderDto): Promise<void> => {
        try {
            const res = await orderService.updateById(id, order);
            dispatch({type: OrderActionType.EDIT_ORDER, payload: res});
        } catch (e) {
            handleError(e);
        }
    };

    const getOrder = async (id: number): Promise<OrderDto> => {
        try {
            return await orderService.getById(id);
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const deleteOrder = async (id: number): Promise<void> => {
        try {
            await orderService.deleteById(id);
            dispatch({type: OrderActionType.REMOVE_ORDER, payload: id});
        } catch (e) {
            handleError(e);
        }
    };

    const generatePdf = async (id: number): Promise<void> => {
        try {
            await orderService.generatePdf(id);
        } catch (e) {
            handleError(e)
        }
    }

    const values = React.useMemo(() => ({
        orders: state.orders,
        createOrder,
        updateOrder,
        deleteOrder,
        getOrders,
        loading,
        getOrder,
        errorOrder: error,
        generatePdf
    }), [state.orders, loading, error]);

    return (
        <OrderContext.Provider value={values}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider;