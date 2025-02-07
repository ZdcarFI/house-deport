"use client";

import React, {createContext, useReducer, useState, useMemo, useEffect} from "react";
import {UserActionType, userInitialState, UserState} from "./userReducer";
import {AxiosError} from "axios";
import {CreateUserDto} from "@/services/User/dto/CreateUserDto";
import {userReducer} from "@/context/AuthContext/userReducer";
import {AuthService} from "@/services/Auth/AuthService";
import {AuthContextType} from "@/@types/auth";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, {user: userInitialState} as UserState);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const authService = new AuthService();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            dispatch({type: UserActionType.ADD_USER, payload: JSON.parse(savedUser)});
        }
        setLoading(false);
    }, []);

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            const errorMessage = e.response?.data?.message || e.message;
            setError(errorMessage);
            if (e.response?.status === 401) {
                dispatch({type: UserActionType.REMOVE_USER});
            }
        } else {
            setError((e as Error).message);
        }
    };

    const clearError = () => setError('');

    const registerUser = async (user: CreateUserDto): Promise<void> => {
        try {
            clearError();
            setLoading(true);
            await authService.register(user);
        } catch (error) {
            handleError(error);
            throw error; // Rethrow to handle in the component
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (email: string, password: string): Promise<void> => {
        try {
            clearError();
            setLoading(true);
            const user = await authService.login(email, password);
            dispatch({type: UserActionType.ADD_USER, payload: user});
            localStorage.setItem('user', JSON.stringify(user));
            const valueCodificate = btoa(JSON.stringify(user));
            // save cookie expiration 7 days
            document.cookie = `userSession=${valueCodificate}; max-age=604800; path=/;`;

        } catch (error) {
            handleError(error);
            throw error; // Rethrow to handle in the component
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async (): Promise<void> => {
        try {
            clearError();
            setLoading(true);
            await authService.logout();
            dispatch({type: UserActionType.REMOVE_USER});
            // remove cookie
            localStorage.removeItem('user');
            document.cookie = `userSession=; max-age=0; path=/;`;
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const values = useMemo(() => ({
        error,
        user: state.user,
        loading,
        registerUser,
        loginUser,
        logoutUser
    }), [error, state.user, loading]);

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;