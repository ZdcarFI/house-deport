
export interface UserDto {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly email: string;
  readonly gender: string;
  readonly role: UserRol;
  readonly lastSession?: Date;
  readonly created_at: Date;
  readonly updated_at: Date;

}

export enum UserRol {
  ADMIN = 'admin',
  WAREHOUSE = 'warehouse',
  SALES = 'sales',
  USER = 'user',
}