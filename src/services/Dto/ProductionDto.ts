import {UserDto} from "@/services/Dto/UserDto";
import {ProductDto} from "@/services/Dto/ProductDto";

export interface ProductionDto {
    readonly id: number;
    readonly status: string,
    readonly user_order: UserDto;
    readonly quantity: number;
    readonly product: ProductDto;
    readonly created_at: Date;
    readonly updated_at: Date;
}

