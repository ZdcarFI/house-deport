import { BASE_URI } from "@/utils/config/config";
import axios from "axios";

export class Service {
    protected apiFetch: any;

    constructor() {
        this.apiFetch = axios.create({
            baseURL: BASE_URI,
            headers: {
                post: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Access-Control-Allow-Origin": "*",
                },
                get: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Access-Control-Allow-Origin": "*",
                },
            },
            withCredentials: true,
        });
    }
}
