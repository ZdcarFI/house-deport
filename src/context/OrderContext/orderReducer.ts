import { OrderDto } from "@/services/Dto/OrderDto";

export interface OrderState {
    orders: OrderDto[];
}

export enum OrderActionType {
    LOAD_ORDERS = 'LOAD_ORDERS',
    ADD_ORDER = 'ADD_ORDER',
    EDIT_ORDER = 'EDIT_ORDER',
    REMOVE_ORDER = 'REMOVE_ORDER'
}

type OrderAction =
    | { type: OrderActionType.LOAD_ORDERS; payload: OrderDto[] }
    | { type: OrderActionType.ADD_ORDER; payload: OrderDto }
    | { type: OrderActionType.EDIT_ORDER; payload: OrderDto }
    | { type: OrderActionType.REMOVE_ORDER; payload: number };

export const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
    switch (action.type) {
        case OrderActionType.LOAD_ORDERS:
            return {
                ...state,
                orders: action.payload
            };
        case OrderActionType.ADD_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.payload]
            };
        case OrderActionType.EDIT_ORDER:
            return {
                ...state,
                orders: state.orders.map(order => 
                    order.id === action.payload.id ? action.payload : order
                )
            };
        case OrderActionType.REMOVE_ORDER:
            return {
                ...state,
                orders: state.orders.filter(order => order.id !== action.payload)
            };
        default:
            return state;
    }
};