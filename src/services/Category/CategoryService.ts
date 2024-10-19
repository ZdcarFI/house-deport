import {Service} from "../Service";
import {CreateCategoryDto} from "./dto/CreateCategoryDto";
import {PARAM_CATEGORY} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {UpdateProductDto} from "@/services/Product/dto/UpdateProductDto";
import {CategoryDto} from "@/services/Dto/CategoryDto";


export class CategoryService extends Service {
    protected param: string = PARAM_CATEGORY;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<CategoryDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<CategoryDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateCategoryDto): Promise<CategoryDto> {
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

    async updateById(id: number, product: UpdateProductDto): Promise<CategoryDto> {
        const response: AxiosResponse = await this.apiFetch.put(`${this.param}/${id}`, product);
        return response.data;
    }
}
