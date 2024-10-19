import { UserDto } from "../Dto/UserDto";
import { Service } from "../Service";

export class AuthService extends Service {
    constructor() {
        super();
    }

    async login(username: string, password: string): Promise<UserDto> {
        const response = await this.apiFetch.post('/login-username', {username, password});
        return response.data;
    }

    async logout(): Promise<boolean> {
        await this.apiFetch.delete('/logout');
        return true;
    }
}