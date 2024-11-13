export interface ProductBasicCreateDto {
    readonly id: number;
    readonly quantity: number;
    readonly productWarehouseId: number;
}

export interface CreateOrderDto {

    readonly numFac: string;
    readonly clientId: number;
    readonly userId: number;
    readonly products: ProductBasicCreateDto[];
}