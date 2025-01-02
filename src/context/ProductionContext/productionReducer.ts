import {ProductionDto} from "@/services/Dto/ProductionDto";

export interface ProductionState {
    productions: ProductionDto[];
}

export enum ProductionActionType {
    LOAD_PRODUCTIONS = 'LOAD_PRODUCTIONS',
    ADD_PRODUCTION = 'ADD_PRODUCTION',
    EDIT_PRODUCTION = 'EDIT_PRODUCTION',
    REMOVE_PRODUCTION = 'REMOVE_PRODUCTION'
}

type ProductionAction =
    | { type: ProductionActionType.LOAD_PRODUCTIONS; payload: ProductionDto[] }
    | { type: ProductionActionType.ADD_PRODUCTION; payload: ProductionDto }
    | { type: ProductionActionType.EDIT_PRODUCTION; payload: ProductionDto }
    | { type: ProductionActionType.REMOVE_PRODUCTION; payload: number };

export const productionReducer = (state: ProductionState, action: ProductionAction): ProductionState => {
    switch (action.type) {
        case ProductionActionType.LOAD_PRODUCTIONS:
            return {
                ...state,
                productions: action.payload
            };
        case ProductionActionType.ADD_PRODUCTION:
            return {
                ...state,
                productions: [...state.productions, action.payload]
            };
        case ProductionActionType.EDIT_PRODUCTION:
            return {
                ...state,
                productions: state.productions.map(production =>
                    production.id === action.payload.id ? action.payload : production
                )
            };
        case ProductionActionType.REMOVE_PRODUCTION:
            return {
                ...state,
                productions: state.productions.filter(production => production.id !== action.payload)
            };
        default:
            return state;
    }
};