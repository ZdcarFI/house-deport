import { SizeDto } from "@/services/Dto/SizeDto";

export interface SizeState {
    sizes: SizeDto[];
}

export enum SizeActionType {
    LOAD_SIZES = 'LOAD_SIZES',
    ADD_SIZE = 'ADD_SIZE',
    EDIT_SIZE = 'EDIT_SIZE',
    REMOVE_SIZE = 'REMOVE_SIZE'
}

type SizeAction =
    | { type: SizeActionType.LOAD_SIZES; payload: SizeDto[] }
    | { type: SizeActionType.ADD_SIZE; payload: SizeDto }
    | { type: SizeActionType.EDIT_SIZE; payload: SizeDto }
    | { type: SizeActionType.REMOVE_SIZE; payload: number };

export const sizeReducer = (state: SizeState, action: SizeAction): SizeState => {
    switch (action.type) {
        case SizeActionType.LOAD_SIZES:
            return {
                ...state,
                sizes: action.payload
            };
        case SizeActionType.ADD_SIZE:
            return {
                ...state,
                sizes: [...state.sizes, action.payload]
            };
        case SizeActionType.EDIT_SIZE:
            return {
                ...state,
                sizes: state.sizes.map(size => 
                    size.id === action.payload.id ? action.payload : size
                )
            };
        case SizeActionType.REMOVE_SIZE:
            return {
                ...state,
                sizes: state.sizes.filter(size => size.id !== action.payload)
            };
        default:
            return state;
    }
};