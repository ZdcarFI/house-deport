import {Service} from "../Service";
import {CreateSizeDto} from "./dto/CreateSizeDto";
import {PARAM_SIZE} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {SizeDto} from "@/services/Dto/SizeDto";
import { UpdateSizeDto } from "./dto/UpdateSizeDto";


export class SizeService extends Service {
    protected param: string = PARAM_SIZE;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<SizeDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        console.log(response.data);
        
        return response.data;
    }

    async getById(id: number): Promise<SizeDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateSizeDto): Promise<SizeDto> {
        const response: AxiosResponse = await this.apiFetch.post(this.param, product);
        return response.data;
    }

    async deleteById(id: number): Promise<boolean> {
        const response: AxiosResponse = await this.apiFetch.delete(`${this.param}/${id}`);
        if (response.status !== 200) {
            throw new Error('Error deleting size');
        }
        return true;
    }

    async updateById(id: number, product: UpdateSizeDto): Promise<SizeDto> {
        const response: AxiosResponse = await this.apiFetch.put(`${this.param}/${id}`, product);
        return response.data;
    }
}
