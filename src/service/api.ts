import axios from "axios"
import localforage from "localforage";

const api = axios.create({
    baseURL: import.meta.env.VITE_HOST
});

api.interceptors.request.use(async (config) => {
    const token = await localforage.getItem<{token: string}>('token');
    if(!config.url?.includes("auth")) {
        if(!token) {
            return Promise.reject("Token not found");
        }
        config.headers.Authorization = `Bearer ${token?.token}`;
    }
    return config;
    }, (error) => {
    return Promise.reject(error);
});

export default api;