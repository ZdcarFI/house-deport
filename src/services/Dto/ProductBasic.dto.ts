export interface ProductBasicDto {
    readonly id: number;
    readonly name: string;
    readonly code: string;
    readonly price: number;
    readonly  stockInventory?: number;
}