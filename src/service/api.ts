import axios from "axios"
import localforage from "localforage";

const api = axios.create({
    baseURL: import.meta.env.VITE_HOST
});

api.interceptors.request.use(async (config) => {
    const token = await localforage.getItem('token');
    console.log(token);
    if(!config.url?.includes("auth")) {
        config.headers.Authorization = `Bearer ${token.token}`;
    }
    return config;
    }, (error) => {
    return Promise.reject(error);
});

export default api;