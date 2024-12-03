export interface ClientDto{
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly phone: string;
    readonly email: string;
    readonly address: string;
    readonly numberDocument: string;
    readonly typeDocument: string;
    readonly createdAt:string;
    readonly created_at : Date;
    readonly updated_at : Date;
}