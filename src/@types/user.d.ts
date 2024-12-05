import { UpdateUserDto } from "@/services/User/dto/UpdateUserDto";
import { UserDto } from "@/services/Dto/ClienDto";

export type UserContextType = {
    users: UserDto[];
    createUser: (User: UserDto) => Promise<void>;
    updateUser: (id: number, User: UpdateUserDto) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    getUsers: () => Promise<void>;
    getUser: (id: number) => Promise<UserDto>;
    loading: boolean;
    error: string;
    isModalOpen: boolean;
    selectedUser: UserDto | null;
    isViewMode: boolean;
    openModal: (user: UserDto | null, viewMode: boolean) => void;
    closeModal: () => void;
};