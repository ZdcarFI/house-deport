import {UserDto} from "@/services/Dto/UserDto";

export type AuthContextType = {
    error: string;
    user: UserDto;
    loading: boolean;
    registerUser: (user: CreateUserDto) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    logoutUser: () =>  Promise<void>;
}