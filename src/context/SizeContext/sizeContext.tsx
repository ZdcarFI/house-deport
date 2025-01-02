"use client"

import React, { createContext, useReducer, useState, useMemo, useEffect, useCallback } from "react";
import { SizeService } from "@/services/Size/SizeService";
import { SizeActionType, SizeState, sizeReducer } from "./sizeReducer";
import { SizeContextType } from "@/@types/size";
import { AxiosError } from "axios";
import { CreateSizeDto } from "@/services/Size/dto/CreateSizeDto";
import { UpdateSizeDto } from "@/services/Size/dto/UpdateSizeDto";
import { SizeDto } from "@/services/Dto/SizeDto";

export const SizeContext = createContext<SizeContextType | null>(null);

const sizeService = new SizeService();
const sizeInitialState: SizeDto = {
  id: 0,
  name: '',
    created_at: new Date(),
    updated_at: new Date(),
};

const SizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sizeReducer, { sizes: [] } as SizeState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeDto | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
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
      setSelectedSize(sizeInitialState);
    } catch (e) {
      handleError(e);
    }
  };

  const updateSize = async (id: number, size: UpdateSizeDto): Promise<void> => {
    try {
      const res = await sizeService.updateById(id, size);
      dispatch({ type: SizeActionType.EDIT_SIZE, payload: res });
      setSelectedSize(sizeInitialState);
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

  const openModal = useCallback((size: SizeDto | null = null, viewMode: boolean = false) => {
    setSelectedSize(size);
    setIsViewMode(viewMode);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const values = useMemo(() => ({
    sizes: state.sizes,
    createSize,
    updateSize,
    deleteSize,
    getSizes,
    loading,
    getSize,
    error,
    size: sizeInitialState,
    isModalOpen,
    selectedSize,
    isViewMode,
    openModal,
    closeModal,
  }), [state.sizes, loading, error, isModalOpen, selectedSize, isViewMode, openModal, closeModal]);

  return (
    <SizeContext.Provider value={values}>
      {children}
    </SizeContext.Provider>
  );
};

export default SizeProvider;

