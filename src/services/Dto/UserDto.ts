export interface UserDto{
    readonly id: number,
    readonly firstName: string,
    readonly lastName: string,
    readonly username: string,
    readonly email: string,
    readonly gender: string,
    readonly role: string,
    readonly lastSession?: Date
}