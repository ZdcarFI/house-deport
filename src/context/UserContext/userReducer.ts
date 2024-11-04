import {UserDto} from "@/services/Dto/UserDto";

export interface UserState {
    users: UserDto[];
}

export enum UserActionType {
    ADD_USER = "addUser",
    REMOVE_USER = "removeUser",
    EDIT_USER = "editUser",
    LOAD_USERS = "loadUsers",
}

export type UserAction =
    | { type: UserActionType.ADD_USER; payload: UserDto }
    | { type: UserActionType.REMOVE_USER; payload: number }
    | { type: UserActionType.EDIT_USER; payload: UserDto }
    | { type: UserActionType.LOAD_USERS; payload: UserDto[]};

export const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionType.ADD_USER:
            return {
                ...state,
                users: [...state.users, action.payload],
            };
        case UserActionType.REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(
                    (user) => user.id !== action.payload
                ),
            };
        case UserActionType.EDIT_USER:
            const updatedUser = action.payload;

            const updatedUsers = state.users.map((user) => {
                if (user.id === updatedUser.id) {
                    return updatedUser;
                }
                return user;
            });

            return {
                ...state,
                users: updatedUsers,
            };
        case UserActionType.LOAD_USERS:
            return {
                ...state,
                users: action.payload,
            };
        default:
            return state;
    }
};