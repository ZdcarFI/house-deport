import {UserDto} from "../Dto/UserDto";
import {Service} from "../Service";
import {AxiosResponse} from "axios";
import {CreateUserDto} from "@/services/User/dto/CreateUserDto";
import {PARAM_USER} from "@/utils/config/config";

export class AuthService extends Service {
    constructor() {
        super();
    }

    async login(email: string, password: string): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.post('/login', { email, password });
        return response.data;
    }


    

    async logout(): Promise<boolean> {
        await this.apiFetch.delete('/logout');
        return true;
    }

    async register(user: CreateUserDto): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.post(PARAM_USER, user);
        return response.data;
    }

    async profile(): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.get('/profile');
        return response.data;
    }
}