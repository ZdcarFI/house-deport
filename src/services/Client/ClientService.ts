import {Service} from "../Service";
import {CreateClientDto} from "./dto/CreateClientDto";
import {ClientDto} from "@/services/Dto/ClienDto";
import {PARAM_CLIENT} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {UpdateClientDto} from "@/services/Client/dto/UpdateClientDto";

export class ClientService extends Service {
    protected param: string = PARAM_CLIENT;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<ClientDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<ClientDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateClientDto): Promise<ClientDto> {
        const response: AxiosResponse = await this.apiFetch.post(this.param, product);
        return response.data;
    }

    async deleteById(id: number): Promise<boolean> {
        const response: AxiosResponse = await this.apiFetch.delete(`${this.param}/${id}`);
        if (response.status !== 200) {
            throw new Error('Error deleting client');
        }
        return true;
    }

    async updateById(id: number, product: UpdateClientDto): Promise<ClientDto> {
        const response: AxiosResponse = await this.apiFetch.patch(`${this.param}/${id}`, product);
        return response.data;
    }
}
