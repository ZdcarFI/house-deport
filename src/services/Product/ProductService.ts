import {ProductDto} from "../Dto/ProductDto";
import {Service} from "../Service";
import {CreateProductDto} from "./dto/CreateProductDto";
import {PARAM_PRODUCT} from "@/utils/config/config";
import {AxiosResponse} from "axios";
import {UpdateProductDto} from "@/services/Product/dto/UpdateProductDto";


export class ProductService extends Service {
    protected param: string = PARAM_PRODUCT;

    constructor(otherParam?: string) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<ProductDto[]> {
        const response: AxiosResponse = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<ProductDto> {
        const response: AxiosResponse = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateProductDto): Promise<ProductDto> {
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

    async updateById(id: number, product: UpdateProductDto): Promise<ProductDto> {
        const response: AxiosResponse = await this.apiFetch.put(`${this.param}/${id}`, product);
        return response.data;
    }
}
