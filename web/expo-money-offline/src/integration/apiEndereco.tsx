import axios from "axios";

export const BASE_URL = "https://viacep.com.br/ws/"; // URL base da API

const apiEndereco = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
})

apiEndereco.interceptors.response.use(
    (config) => {
      return config
    },
    (error) =>{
      return Promise.reject(error)
    }
)

export default apiEndereco;