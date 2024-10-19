import {UserDto} from "../Dto/UserDto";
import {Service} from "../Service";
import {AxiosResponse} from "axios";

export class AuthService extends Service {
    constructor() {
        super();
    }

    async login(email: string, password: string): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.post('/login', {email, password});
        return response.data;
    }

    async loginUsername(username: string, password: string): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.post('/login-username', {username, password});
        return response.data;
    }

    async logout(): Promise<boolean> {
        await this.apiFetch.delete('/logout');
        return true;
    }
}