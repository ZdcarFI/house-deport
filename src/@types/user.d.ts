import { CreateUserDto } from "@/services/User/dto/CreateUserDto";
import { UpdateUserDto } from "@/services/User/dto/UpdateUserDto";
import { UserDto } from "@/services/Dto/ClienDto";

export type UserContextType = {
    users: Product[];
    createUser: (User: CreateUserDto) => Promise<void>;
    updateUser: (id:number, User: UpdateUserDto) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    getUsers: () => Promise<void>;
    getUser: (id: number) => Promise<UserDto>;
    loading: boolean;
    error: string;
};