"use client"

import React, { useCallback, useState } from 'react';
import { ProductWarehouseContextType } from "@/@types/productWarehouse";
import { ProductWarehouseDto } from "@/services/Dto/ProductWarehouseDto";

import { AxiosError } from "axios";

import { ProductWarehouseActionType, ProductWarehouseState, productWarehouseReducer } from './productWarehouseReducer';
import { ProductWarehouseService } from '@/services/ProductWarehouse/ProductWarehouseService';
import { CreateProductWarehouseDto } from '@/services/ProductWarehouse/dto/CreateProductWarehouse.dto';
import { UpdateProductWarehouseDto } from '@/services/ProductWarehouse/dto/UpdateProductWarehouse.dto';
import { ProductDto } from '@/services/Dto/ProductDto';
import { WarehouseDto } from '@/services/Dto/WarehouseDto';

export const ProductWarehouseContext = React.createContext<ProductWarehouseContextType | null>(null);
const productWarehouseService = new ProductWarehouseService();

const productWarehouseInitialState: ProductWarehouseDto = {
  id: 0,
  warehouse: {
    id: 0,
    name: "",
    rowMax: 0,
    columnMax: 0,
    status: "",
  },
  product: {
    id: 0,
    name: '',
    code: '',
    price: 0,

  },
  row: 0,
  column: 0,
  quantity: 0,
   productId: 0,
   warehouseId: 0,
  created_at: new Date(),
    updated_at: new Date(),

};

const ProductWarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(productWarehouseReducer, { productWarehouses: [] } as ProductWarehouseState);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductWarehouse, setSelectedProductWarehouse] = useState<ProductWarehouseDto | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const [initialData, setInitialData] = useState<ProductDto | WarehouseDto | null>(null);


  React.useEffect(() => {
    const fetchProductWarehouses = async () => {
      setLoading(true);
      try {
        await getProductWarehouses();
      } catch (e) {
        console.error("Error loading product warehouses:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProductWarehouses();
  }, []);

  const handleError = (e: unknown) => {
    if (e instanceof AxiosError) {
      setError(e.response?.data?.message || e.message);
    } else {
      setError((e as Error).message);
    }
  };

  const getProductWarehouses = async (): Promise<void> => {
    try {
      const productWarehouses = await productWarehouseService.getAll();
      dispatch({ type: ProductWarehouseActionType.LOAD_PRODUCT_WAREHOUSES, payload: productWarehouses });
    } catch (e) {
      handleError(e);
    }
  };

  const createProductWarehouse = async (productWarehouse: CreateProductWarehouseDto): Promise<void> => {
    try {
      const res = await productWarehouseService.create(productWarehouse);
      dispatch({ type: ProductWarehouseActionType.ADD_PRODUCT_WAREHOUSE, payload: res });
      setSelectedProductWarehouse(productWarehouseInitialState);
    } catch (e) {
      handleError(e);
    }
  };

  const updateProductWarehouse = async (id: number, productWarehouse: UpdateProductWarehouseDto): Promise<void> => {
    try {
      const res = await productWarehouseService.updateById(id, productWarehouse);
      dispatch({ type: ProductWarehouseActionType.EDIT_PRODUCT_WAREHOUSE, payload: res });
      setSelectedProductWarehouse(productWarehouseInitialState);
    } catch (e) {
      handleError(e);
    }
  };

  const getProductWarehouse = async (id: number): Promise<ProductWarehouseDto> => {
    try {
      return await productWarehouseService.getById(id);
    } catch (e) {
      handleError(e);
      throw e;
    }
  };

  const deleteProductWarehouse = async (id: number): Promise<void> => {
    try {
      await productWarehouseService.deleteById(id);
      dispatch({ type: ProductWarehouseActionType.REMOVE_PRODUCT_WAREHOUSE, payload: id });
    } catch (e) {
      handleError(e);
    }
  };

  const openModal = useCallback((productWarehouse: ProductWarehouseDto | null, viewMode: boolean, data?: ProductDto | WarehouseDto | null) => {
    setSelectedProductWarehouse(productWarehouse);
    setIsViewMode(viewMode);
    setInitialData(data || null);
    setIsModalOpen(true);
}, []);

const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProductWarehouse(null);
    setIsViewMode(false);
    setInitialData(null);
}, []);

  const values = React.useMemo(() => ({
    productWarehouses: state.productWarehouses,
    createProductWarehouse,
    updateProductWarehouse,
    deleteProductWarehouse,
    getProductWarehouses,
    loading,
    getProductWarehouse,
    error,
    productWarehouse: productWarehouseInitialState,
    isModalOpen,
    selectedProductWarehouse,
    isViewMode,
    initialData,
    openModal,
    closeModal,
  }), [state.productWarehouses, loading,    initialData,,error, isModalOpen, selectedProductWarehouse, isViewMode, openModal, closeModal]);

  return (
    <ProductWarehouseContext.Provider value={values}>
      {children}
    </ProductWarehouseContext.Provider>
  );
};

export default ProductWarehouseProvider;