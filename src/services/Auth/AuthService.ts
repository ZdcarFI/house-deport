import {UserDto} from "../Dto/UserDto";
import {Service} from "../Service";
import {AxiosResponse} from "axios";

export class AuthService extends Service {
    constructor() {
        super();
    }



    async loginUsername(username: string, password: string): Promise<UserDto> {
        const response: AxiosResponse = await this.apiFetch.post('/login-username', { username, password });
        const user = response.data;
        
        // Guardar el usuario en localStorage (incluyendo el rol)
        localStorage.setItem('user', JSON.stringify(user));
        
        return user;
    }
    

    async logout(): Promise<boolean> {
        await this.apiFetch.delete('/logout');
        return true;
    }
}