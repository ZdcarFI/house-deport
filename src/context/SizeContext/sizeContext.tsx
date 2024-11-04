"use client"
import { SizeService } from "@/services/Size/SizeService";
import React from "react";
import { SizeActionType, SizeState, sizeReducer } from "./sizeReducer";
import { SizeContextType } from "@/@types/size";
import { AxiosError } from "axios";
import { CreateSizeDto } from "@/services/Size/dto/CreateSizeDto";
import { UpdateSizeDto } from "@/services/Size/dto/UpdateSizeDto";
import { SizeDto } from "@/services/Dto/SizeDto";

export const SizeContext = React.createContext<SizeContextType | null>(null);
const sizeService = new SizeService();
const SizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(sizeReducer, { sizes: [] } as SizeState);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
        const fetchSizes = async () => {
            setLoading(true);
            try {
                await getSizes();
            } catch (e) {
                console.error("Error loading sizes:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchSizes();
    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const getSizes = async (): Promise<void> => {
        try {
            const sizes = await sizeService.getAll();
            dispatch({ type: SizeActionType.LOAD_SIZES, payload: sizes });
        } catch (e) {
            handleError(e);
        }
    };

    const createSize = async (size: CreateSizeDto): Promise<void> => {
        try {
            const res = await sizeService.create(size);
            dispatch({ type: SizeActionType.ADD_SIZE, payload: res });
        } catch (e) {
            handleError(e);
        }
    };

    const updateSize = async (id: number, size: UpdateSizeDto): Promise<void> => {
        try {
            const res = await sizeService.updateById(id, size);
            dispatch({ type: SizeActionType.EDIT_SIZE, payload: res });
        } catch (e) {
            handleError(e);
        }
    };

    const getSize = async (id: number): Promise<SizeDto> => {
        try {
            return await sizeService.getById(id);
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const deleteSize = async (id: number): Promise<void> => {
        try {
            await sizeService.deleteById(id);
            dispatch({ type: SizeActionType.REMOVE_SIZE, payload: id });
        } catch (e) {
            handleError(e);
        }
    };

    const values = React.useMemo(() => ({
        sizes: state.sizes,
        createSize,
        updateSize,
        deleteSize,
        getSizes,
        loading,
        getSize,
        error
    }), [state.sizes, loading, error]);

    return (
        <SizeContext.Provider value={values}>
            {children}
        </SizeContext.Provider>
    );
};

export default SizeProvider;