import {Service} from "../Service";
import {CreateWarehouseDto} from "./dto/CreateWarehouseDto";
import {PARAM_WAREHOUSE} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {WarehouseDto} from "@/services/Dto/WarehouseDto";
import {UpdateWarehouseDto} from "@/services/Warehouse/dto/UpdateWarehouseDto";


export class WarehouseService extends Service {
    protected param: string = PARAM_WAREHOUSE;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<WarehouseDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<WarehouseDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateWarehouseDto): Promise<WarehouseDto> {
        const response: AxiosResponse = await this.apiFetch.post(this.param, product);
        return response.data;
    }

    async deleteById(id: number): Promise<boolean> {
        const response: AxiosResponse = await this.apiFetch.delete(`${this.param}/${id}`);
        if (response.status !== 200) {
            throw new Error('Error deleting warehouse');
        }
        return true;
    }

    async updateById(id: number, product: UpdateWarehouseDto): Promise<WarehouseDto> {
        const response: AxiosResponse = await this.apiFetch.patch(`${this.param}/${id}`, product);
        return response.data;
    }
}
