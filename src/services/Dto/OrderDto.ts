import {UserDto} from "@/services/Dto/UserDto";
import {ClientDto} from "@/services/Dto/ClienDto";

interface ProductBasicDto {
    readonly id: number;
    readonly name: string;
    readonly code: string;
    readonly price: number;
}

interface DetailDto {
    readonly id: number;
    readonly product: ProductBasicDto;
    readonly quantity: number;
    readonly unitPrice: number;
    readonly total: number;
}

export interface OrderDto{
    readonly id: number;
    readonly numFac: string;
    readonly user: UserDto;
    readonly client: ClientDto;
    readonly date: Date;
    readonly subtotal: number;
    readonly total: number;
    readonly details: DetailDto[];
}