import {Service} from "../Service";
import {CreateProductionDto} from "./dto/CreateProductionDto";
import {PARAM_PRODUCTION} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {ProductionDto} from "@/services/Dto/ProductionDto";
import {UpdateProductionDto} from "./dto/UpdateProductionDto";


export class ProductionService extends Service {
    protected param: string = PARAM_PRODUCTION;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<ProductionDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<ProductionDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateProductionDto): Promise<ProductionDto> {
        const response: AxiosResponse = await this.apiFetch.post(this.param, product);
        return response.data;
    }

    async deleteById(id: number): Promise<boolean> {
        const response: AxiosResponse = await this.apiFetch.delete(`${this.param}/${id}`);
        if (response.status !== 200) {
            throw new Error('Error deleting product');
        }
        return true;
    }

    async updateById(id: number, product: UpdateProductionDto): Promise<ProductionDto> {
        const response: AxiosResponse = await this.apiFetch.patch(`${this.param}/${id}`, product);
        return response.data;
    }
}