export interface UpdateProductDto {
    readonly name?: string;
    readonly code?: string;
    readonly price?: number;
    readonly categoryId?: number;
    readonly sizeId: number;
    readonly stockInventory?: number;
    readonly stockStore?: number;
}