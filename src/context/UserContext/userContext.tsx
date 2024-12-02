"use client"
import React, { useCallback, useState } from 'react';
import { UserContextType } from "@/@types/user";
import { UserDto } from "@/services/Dto/UserDto";
import { UserService } from "@/services/User/UserService";
import { CreateUserDto } from "@/services/User/dto/CreateUserDto";
import { AxiosError } from "axios";
import { UpdateUserDto } from "@/services/User/dto/UpdateUserDto";
import { UserActionType, UserState, userReducer } from './userReducer';

export const UserContext = React.createContext<UserContextType | null>(null);

const userService = new UserService();

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(userReducer, { users: [] } as UserState);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [userLog, setUserLog] = React.useState<UserDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    React.useEffect(() => {

        setUserLog(JSON.parse(localStorage.getItem('user') || 'null'));

        const fetchUsers = async () => {
            setLoading(true);
            try {
                await getUsers();
            } catch (e) {
                console.error("Error loading users:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const getUsers = async (): Promise<void> => {
        try {
            const users = await userService.getAll();
            dispatch({ type: UserActionType.LOAD_USERS, payload: users });
        } catch (e) {
            handleError(e);
        }
    };

    const createUser = async (user: CreateUserDto): Promise<void> => {
        try {
            const res = await userService.create(user);
            dispatch({ type: UserActionType.ADD_USER, payload: res });
        } catch (e) {
            handleError(e);
        }
    };

    const updateUser = async (id: number, user: UpdateUserDto): Promise<void> => {
        try {
            const res = await userService.updateById(id, user);
            dispatch({ type: UserActionType.EDIT_USER, payload: res });
        } catch (e) {
            handleError(e);
        }
    };

    const getUser = async (id: number): Promise<UserDto> => {
        try {
            return await userService.getById(id);
        } catch (e) {
            handleError(e);
            throw e;
        }
    };

    const deleteUser = async (id: number): Promise<void> => {
        try {
            await userService.deleteById(id);
            dispatch({ type: UserActionType.REMOVE_USER, payload: id });
        } catch (e) {
            handleError(e);
        }
    };

    const openModal = useCallback((user: UserDto | null = null, viewMode: boolean = false) => {
        setSelectedUser(user);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const values = React.useMemo(() => ({
        users: state.users,
        createUser,
        updateUser,
        deleteUser,
        getUsers,
        loading,
        getUser,
        error,
        userLog,
        isModalOpen,
        selectedUser,
        isViewMode,
        openModal,
        closeModal,
    }), [state.users, loading, error, isModalOpen, selectedUser, isViewMode, openModal, closeModal]);

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
