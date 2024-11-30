import {ProductWarehouseBasicDto} from "@/services/Dto/ProductDto";

export interface DataCartDto {
    readonly id: number;
    readonly name: string;
    readonly price: number;
    readonly size: {
        readonly id: number;
        readonly name: string
    };
    readonly category: {
        readonly id: number;
        readonly name: string
    };
    readonly productWarehouses: ProductWarehouseBasicDto[];
    readonly location: {
        readonly id: number;
        readonly name: string;
        readonly row: number;
        readonly column: number;
        readonly color: string;
        readonly quantity: number;
    };
    readonly quantity: number;
}