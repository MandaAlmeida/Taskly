import axios from "axios";
import { getToken } from "@/storage/token/getToken";

const api = axios.create({
    baseURL: "http://10.0.2.2:3000",
});


api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token.replace(/"/g, "")}`;
    }

    return config;
});

export default api;
