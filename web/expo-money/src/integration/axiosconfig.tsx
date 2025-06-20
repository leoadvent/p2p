import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const BASE_URL = "http://192.168.1.97:8080"; // URL base da API

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
})

// Interceptor para adicionar o X-Tenant-ID antes de cada requisição
api.interceptors.request.use(async (config) => {
    const realmName = await AsyncStorage.getItem("realmName");
    const token = await AsyncStorage.getItem('token_api')
    if (realmName) {
      config.headers["X-Tenant-ID"] = realmName;
    }
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (config) => {
      return config
    },
    (error) =>{
      return Promise.reject(error)
    }
  )


export default api;