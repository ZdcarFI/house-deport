import {UserDto} from "@/services/Dto/UserDto";
import {ClientDto} from "@/services/Dto/ClienDto";

export interface ProductBasicDto {
    readonly id: number;
    readonly name: string;
    readonly code: string;
    readonly price: number;
}

export interface DetailDto {
    readonly id: number;
    readonly product: ProductBasicDto;
    readonly quantity: number;
    readonly unitPrice: number;
    readonly total: number;
}

export interface OrderDto {
    readonly id: number;
    readonly numFac: string;
    readonly status: string,
    readonly tax?: number
    readonly discount?: number
    readonly user: UserDto;
    readonly client: ClientDto;
    readonly date: Date;
    readonly subtotal: number;
    readonly total: number;
    readonly details: DetailDto[];
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly  paymentType: string;
}