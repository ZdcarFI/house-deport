"use client"

import React from 'react';
import {ProductWarehouseContextType} from "@/@types/productWarehouse";
import {ProductWarehouseDto} from "@/services/Dto/ProductWarehouseDto";

import {AxiosError} from "axios";

import { ProductWarehouseActionType, ProductWarehouseState, productWarehouseReducer} from './productWarehouseReducer';
import { ProductWarehouseService } from '@/services/ProductWarehouse/ProductWarehouseService';
import { CreateProductWarehouseDto } from '@/services/ProductWarehouse/dto/CreateProductWarehouse.dto';
import { UpdateProductWarehouseDto } from '@/services/ProductWarehouse/dto/UpdateProductWarehouse.dto';

export const ProductWarehouseContext = React.createContext<ProductWarehouseContextType | null>(null);
const productWarehouseService = new ProductWarehouseService();

const ProductWarehouseProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [state, dispatch] = React.useReducer(productWarehouseReducer, {productWarehouses: []} as ProductWarehouseState);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

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
      dispatch({type: ProductWarehouseActionType.LOAD_PRODUCT_WAREHOUSES, payload: productWarehouses});
    } catch (e) {
      handleError(e);
    }
  };

  const createProductWarehouse = async (productWarehouse: CreateProductWarehouseDto): Promise<void> => {
    try {
      const res = await productWarehouseService.create(productWarehouse);
      dispatch({type: ProductWarehouseActionType.ADD_PRODUCT_WAREHOUSE, payload: res});
    } catch (e) {
      handleError(e);
    }
  };

  const updateProductWarehouse = async (id: number, productWarehouse: UpdateProductWarehouseDto): Promise<void> => {
    try {
      const res = await productWarehouseService.updateById(id, productWarehouse);
      dispatch({type: ProductWarehouseActionType.EDIT_PRODUCT_WAREHOUSE, payload: res});
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
      dispatch({type: ProductWarehouseActionType.REMOVE_PRODUCT_WAREHOUSE, payload: id});
    } catch (e) {
      handleError(e);
    }
  };

  const values = React.useMemo(() => ({
    productWarehouses: state.productWarehouses,
    createProductWarehouse,
    updateProductWarehouse,
    deleteProductWarehouse,
    getProductWarehouses,
    loading,
    getProductWarehouse,
    error
  }), [state.productWarehouses, loading, error]);

  return (
    <ProductWarehouseContext.Provider value={values}>
      {children}
    </ProductWarehouseContext.Provider>
  );
};

export default ProductWarehouseProvider;