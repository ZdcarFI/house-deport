export interface CreateUserDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly gender: string;
}