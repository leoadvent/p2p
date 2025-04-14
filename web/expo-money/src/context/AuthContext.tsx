import { createContext, useState } from "react";
import api from "../integration/axiosconfig";
import { UserRealmFindNameDTO } from "../types/userRealmFindName";
import { AccessTokenResponse } from "../types/accessTokenResponse";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Userintrospect } from "../types/userintrospect";

interface AuthContextData {
    recoveryRealm: (login: string) => void
    realmName: string
    loginRealm: (loginRealmClient: LoginRealmClient) => void
    accessTokenResponse: AccessTokenResponse
    logado: boolean
    userintrospect: Userintrospect
    logoutRealm: () => void
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: any) {

    let realmName = ""
    const [accessTokenResponse, setAccessTokenResponse] = useState<AccessTokenResponse>({} as AccessTokenResponse)
    const [logado, setLogado] = useState<boolean>(false)
    const [userintrospect, setUserIntrospect] = useState<Userintrospect>({} as Userintrospect)

    function recoveryRealm(login: string){
        const data: UserRealmFindNameDTO = { username: login}
        api.post<string>(`/userRealm/recoveryRealm`, data).then((response) => {
            realmName = response.data
            AsyncStorage.setItem("realmName", response.data)
        }).catch((error) => {
            alert("Erro ao recuperar o Realm. Verifique os dados e tente novamente.")
        })
    }

    function logoutRealm(){
        setAccessTokenResponse({} as AccessTokenResponse)
        AsyncStorage.removeItem("token_api")
        AsyncStorage.removeItem("refresh_token_api")
        setLogado(false)
    }
    
    async function loginRealm(loginRealmClient: LoginRealmClient) {
        
        const realmName = await AsyncStorage.getItem("realmName");
        const data: LoginRealmClient = { 
            realm: realmName, 
            username: loginRealmClient.username, 
            password: loginRealmClient.password
        }
        api.post<AccessTokenResponse>(`/keycloak/login`, data).then((response) => {
            setAccessTokenResponse(response.data)
            AsyncStorage.setItem("token_api", response.data.access_token)
            AsyncStorage.setItem("refresh_token_api", response.data.refresh_token)
            setLogado(true)
            userIntrospect()
        }).catch((error) => {
            console.error("Erro ao realizar o login: ", error)
            setLogado(false)
            setAccessTokenResponse({} as AccessTokenResponse)
            AsyncStorage.removeItem("token_api")
            AsyncStorage.removeItem("refresh_token_api")
            alert("Erro ao realizar o login.")
        })

        

        function userIntrospect() {
            api.get<Userintrospect>(`/keycloak/userintrospect`).then((response) => {
                setUserIntrospect(response.data)
                AsyncStorage.setItem("userIntrospect", JSON.stringify(response.data))
            }).catch((error) => {
                console.error("Erro ao realizar o userIntrospect: ", error)
                alert("Erro ao realizar o userIntrospect.")
            })
        }

    }

    return (
        <AuthContext.Provider value={{recoveryRealm, realmName, loginRealm, accessTokenResponse, logado, userintrospect, logoutRealm}}>
            {children}
        </AuthContext.Provider>
    )
}