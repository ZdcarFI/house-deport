import {UserDto, UserRol} from "@/services/Dto/UserDto";

export const userInitialState: UserDto = {
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: UserRol.USER,
    gender: '',
};

export interface UserState {
    user: UserDto;
}

export enum UserActionType {
    ADD_USER = "addUser",
    REMOVE_USER = "removeUser",
    EDIT_USER = "editUser",
    LOAD_USER = "loadUser",
}

export type UserAction =
    | { type: UserActionType.ADD_USER; payload: UserDto }
    | { type: UserActionType.REMOVE_USER; }
    | { type: UserActionType.EDIT_USER; payload: UserDto }
    | { type: UserActionType.LOAD_USER;};

export const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
         case UserActionType.LOAD_USER:
            const user = localStorage.getItem('user');
            console.log(user);
            if (user) {
                return {
                    ...state,
                    user: JSON.parse(user),
                }
            }
            return state;
        case UserActionType.ADD_USER:
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
            };
        case UserActionType.REMOVE_USER:
            localStorage.removeItem('user');
            return {
                ...state,
                user: userInitialState
            };
        case UserActionType.EDIT_USER:
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};