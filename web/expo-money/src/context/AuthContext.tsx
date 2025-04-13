import { createContext, useState } from "react";
import api from "../integration/axiosconfig";
import { UserRealmFindNameDTO } from "../types/userRealmFindName";
import { AccessTokenResponse } from "../types/accessTokenResponse";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
    recoveryRealm: (login: string) => void
    realmName: string
    loginRealm: (loginRealmClient: LoginRealmClient) => void
    accessTokenResponse: AccessTokenResponse
    logado: boolean
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: any) {

    const [realmName, setRealmName] = useState<string>("")
    const [accessTokenResponse, setAccessTokenResponse] = useState<AccessTokenResponse>({} as AccessTokenResponse)
    const [logado, setLogado] = useState<boolean>(false)

    function recoveryRealm(login: string){
        const data: UserRealmFindNameDTO = { username: login}
        api.post<string>(`/userRealm/recoveryRealm`, data).then((response) => {
            setRealmName(response.data)
            localStorage.setItem("realmName", response.data)
        }).catch((error) => {
            alert("Erro ao recuperar o Realm. Verifique os dados e tente novamente.")
        })
    }

    function loginRealm(loginRealmClient: LoginRealmClient) {
        const data: LoginRealmClient = { realm: realmName, username: loginRealmClient.username, password: loginRealmClient.password}
        console.log("LoginRealmClient: ", data)
        api.post<AccessTokenResponse>(`/keycloak/login`, data).then((response) => {
            console.log("Response: ", response.data)
            setAccessTokenResponse(response.data)
            AsyncStorage.setItem("realmName", data.realm)
            AsyncStorage.setItem("token_api", response.data.access_token)
            AsyncStorage.setItem("refresh_token_api", response.data.refresh_token)
            setLogado(true)
        }).catch((error) => {
            console.log("Erro ao realizar o login: ", error)
            setLogado(false)
            setAccessTokenResponse({} as AccessTokenResponse)
            AsyncStorage.removeItem("token_api")
            AsyncStorage.removeItem("refresh_token_api")
            alert("Erro ao realizar o login.")
        })

    }

    return (
        <AuthContext.Provider value={{recoveryRealm, realmName, loginRealm, accessTokenResponse, logado}}>
            {children}
        </AuthContext.Provider>
    )
}