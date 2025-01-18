"use client"

import React, {createContext, useReducer, useState, useMemo, useEffect, useCallback} from "react";
import {ProductionService} from "@/services/Production/ProductionService";
import {ProductionActionType, ProductionState, productionReducer} from "./productionReducer";
import {ProductionContextType} from "@/@types/production";
import {AxiosError} from "axios";
import {CreateProductionDto} from "@/services/Production/dto/CreateProductionDto";
import {UpdateProductionDto} from "@/services/Production/dto/UpdateProductionDto";
import {ProductionDto} from "@/services/Dto/ProductionDto";
import {UserRol} from "@/services/Dto/UserDto";

export const ProductionContext = createContext<ProductionContextType | null>(null);

const productionService = new ProductionService();
const productionInitialState: ProductionDto = {
    id: 0,
    status: "", // Valor predeterminado, ajusta según sea necesario
    user_order: {
        id: 0,
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        gender: "",
        role: UserRol.USER, // Usa el valor predeterminado que tenga sentido para tu lógica
        lastSession: undefined, // Puede ser `null` o `undefined` si es opcional
        created_at: new Date(),
        updated_at: new Date(),
    },
    quantity: 0, // Valor predeterminado
    product: {
        id: 0,
        name: "",
        code: "",
        price: 0,
        category: {
            id: 0, // Si `CategoryBasicDto` tiene más propiedades, añádelas aquí
            name: "",
        },
        size: {
            id: 0, // Si `SizeDto` tiene más propiedades, añádelas aquí
            name: "",
            created_at: new Date(),
            updated_at: new Date(),
        },
        productWarehouse: [], // Lista vacía como predeterminado
        stockInventory: 0,
        stockStore: 0,
        created_at: new Date(),
        updated_at: new Date(),
    },
    created_at: new Date(), // Fecha actual como predeterminado
    updated_at: new Date(), // Fecha actual como predeterminado
};


const ProductionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(productionReducer, {productions: []} as ProductionState);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduction, setSelectedProduction] = useState<ProductionDto | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        const fetchProductions = async () => {
            setLoading(true);
            try {
                await getProductions();
            } catch (e) {
                console.error("Error loading productions:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProductions();
    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const getProductions = async (): Promise<void> => {
        try {
            const productions = await productionService.getAll();
            dispatch({type: ProductionActionType.LOAD_PRODUCTIONS, payload: productions});
        } catch (e) {
            handleError(e);
        }
    };

    const createProduction = async (production: CreateProductionDto): Promise<void> => {
        try {
            const res = await productionService.create(production);
            dispatch({type: ProductionActionType.ADD_PRODUCTION, payload: res});
            setSelectedProduction(productionInitialState);
        } catch (e) {
            handleError(e);
        }
    };

    const updateProduction = async (id: number, production: UpdateProductionDto): Promise<void> => {
        try {
            const res = await productionService.updateById(id, production);
            dispatch({type: ProductionActionType.EDIT_PRODUCTION, payload: res});
            setSelectedProduction(productionInitialState);
        } catch (e) {
            handleError(e);
        }
    };

    const getProduction = async (id: number): Promise<ProductionDto> => {
        try {
            return await productionService.getById(id);
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const deleteProduction = async (id: number): Promise<void> => {
        try {
            await productionService.deleteById(id);
            dispatch({type: ProductionActionType.REMOVE_PRODUCTION, payload: id});
        } catch (e) {
            handleError(e);
        }
    };

    const openModal = useCallback((production: ProductionDto | null = null, viewMode: boolean = false) => {
        setSelectedProduction(production);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const values = useMemo(() => ({
        productions: state.productions,
        createProduction,
        updateProduction,
        deleteProduction,
        getProductions,
        loading,
        getProduction,
        error,
        errorProduction: error,
        production: productionInitialState,
        isModalOpen,
        selectedProduction,
        isViewMode,
        openModal,
        closeModal,
    }), [state.productions, loading, error, isModalOpen, selectedProduction, isViewMode, openModal, closeModal]);

    return (
        <ProductionContext.Provider value={values}>
            {children}
        </ProductionContext.Provider>
    );
};

export default ProductionProvider;

