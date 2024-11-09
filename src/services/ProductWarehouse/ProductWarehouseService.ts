import {ProductWarehouseDto} from "../Dto/ProductWarehouseDto";
import {Service} from "../Service";
import {PARAM_PRODUCT_WAREHOUSE} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import { CreateProductWarehouseDto } from "./dto/CreateProductWarehouse.dto";
import { UpdateProductWarehouseDto } from "./dto/UpdateProductWarehouse.dto";


export class ProductWarehouseService extends Service {
    protected param: string = PARAM_PRODUCT_WAREHOUSE;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<ProductWarehouseDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<ProductWarehouseDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(productWarehouse: CreateProductWarehouseDto): Promise<ProductWarehouseDto> {
        const response: AxiosResponse = await this.apiFetch.post(this.param, productWarehouse);
        return response.data;
    }

    async deleteById(id: number): Promise<boolean> {
        const response: AxiosResponse = await this.apiFetch.delete(`${this.param}/${id}`);
        if (response.status !== 200) {
            throw new Error('Error deleting productWarehouse');
        }
        return true;
    }

    async updateById(id: number, productWarehouse: UpdateProductWarehouseDto): Promise<ProductWarehouseDto> {
        const response: AxiosResponse = await this.apiFetch.put(`${this.param}/${id}`, productWarehouse);
        return response.data;
    }
}
