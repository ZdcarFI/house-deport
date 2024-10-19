import { ProductDto } from "../Dto/ProductDto";
import { Service } from "../Service";
import { CreateProductDto } from "./dto/CreateProductDto";


export class ProductService extends Service {
    protected param: String = "/products";

    constructor(otherParam?: String) {
        super();
        if (otherParam !== undefined) {
            this.param = otherParam;
        }
    }

    async getAll(): Promise<ProductDto[]> {
        const response = await this.apiFetch.get(this.param);
        return response.data;
    }

    async getById(id: number): Promise<ProductDto> {
        const response = await this.apiFetch.get(`${this.param}/${id}`);
        return response.data;
    }

    async create(product: CreateProductDto): Promise<ProductDto> {
        const response = await this.apiFetch.post(this.param, product);
        return response.data;
    }

    async deleteById(id: number): Promise<void> {
        await this.apiFetch.delete(`${this.param}/${id}`);
    }
}