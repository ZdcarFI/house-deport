export interface ProductBasicWithLocationDto {
    readonly id: number;
    readonly name: string;
    readonly code: string;
    readonly price: string;
    readonly quantity: number;
    readonly row: number;
    readonly column: number;

}
export interface WarehouseDto {
    readonly id: number;
    readonly name: string;
    readonly rowMax: number;
    readonly columnMax: number;
    readonly status: string;
    readonly description: string;
    readonly color: string;
    readonly spaces: number;
    readonly spacesUsed: number;
    readonly products: ProductBasicWithLocationDto[];
    readonly created_at : Date;
    readonly updated_at : Date;
}