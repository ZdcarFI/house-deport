"use client"

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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [userTest, setUserTest] = useState(userInitialState);

    const authService = new AuthService();

    useEffect(() => {
        setLoading(true);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            dispatch({type: UserActionType.ADD_USER, payload: JSON.parse(savedUser)});
            setUserTest(JSON.parse(savedUser));
        } else {
            authService.profile().then((res) => {
                dispatch({type: UserActionType.ADD_USER, payload: res});
                setUserTest(res)
            }).catch((e) => {
                handleError(e);
            }).finally(() => {
                setLoading(false);
            });
        }
        setLoading(false);

    }, []);


    const registerUser = async (user: CreateUserDto): Promise<void> => {
        try {
            await authService.register(user);
        } catch (error) {
            handleError(error);
        }
    }

    const loginUser = async (email: string, password: string): Promise<void> => {
        try {
            const user = await authService.login(email, password);
            dispatch({type: UserActionType.ADD_USER, payload: user});
        } catch (error) {
            handleError(error);
        }
    }

    const handleError = (e: unknown) => {
        if (e instanceof AxiosError) {
            setError(e.response?.data?.message || e.message);
        } else {
            setError((e as Error).message);
        }
    };

    const logoutUser = async (): Promise<void> => {
        try {
            await authService.logout();
            dispatch({type: UserActionType.REMOVE_USER});
        } catch (error) {
            handleError(error);
        }
    }

    const values = useMemo(() => ({
        error,
        user: userTest,
        loading,
        registerUser,
        loginUser,
        logoutUser
    }), []);

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

