import {Service} from "../Service";
import {CreateUserDto} from "./dto/CreateUserDto";
import {PARAM_USER} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {UserDto} from "@/services/Dto/UserDto";
import {UpdateUserDto} from "@/services/User/dto/UpdateUserDto";


export class UserService extends Service {
    protected param: string = PARAM_USER;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<UserDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateUserDto): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.post(this.param, product);
        return response.data;
    }

    async deleteById(id: number): Promise<boolean> {
        const response: AxiosResponse = await this.apiFetch.delete(`${this.param}/${id}`);
        if (response.status !== 200) {
            throw new Error('Error deleting user');
        }
        return true;
    }

    async updateById(id: number, product: UpdateUserDto): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.patch(`${this.param}/${id}`, product);
        return response.data;
    }
}
