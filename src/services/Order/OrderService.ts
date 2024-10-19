import {Service} from "../Service";
import {CreateOrderDto} from "./dto/CreateOrderDto";
import {PARAM_ORDER} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {OrderDto} from "@/services/Dto/OrderDto";
import {UpdateOrderDto} from "@/services/Order/dto/UpdateOrderDto";


export class OrderService extends Service {
    protected param: string = PARAM_ORDER;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<OrderDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<OrderDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateOrderDto): Promise<OrderDto> {
        const response: AxiosResponse = await this.apiFetch.post(this.param, product);
        return response.data;
    }

    async deleteById(id: number): Promise<boolean> {
        const response: AxiosResponse = await this.apiFetch.delete(`${this.param}/${id}`);
        if (response.status !== 200) {
            throw new Error('Error deleting order');
        }
        return true;
    }

    async updateById(id: number, product: UpdateOrderDto): Promise<OrderDto> {
        const response: AxiosResponse = await this.apiFetch.put(`${this.param}/${id}`, product);
        return response.data;
    }
}
