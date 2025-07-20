import { createContext, useState } from "react"
import autenticarComBiometria from "../seguranca/AutenticacaoComBiometria"

interface AuthContextData {
    Login: () => void
    Logout: () => void
    logado: boolean 
}

export const AuthContext = createContext({} as AuthContextData)

export function AuhtProvider ({ children } : any){

    const [logado, setLogado] = useState<boolean>(false)
    

    async function Login(){
        const autenticaoBiometrica = await autenticarComBiometria()
        setLogado(autenticaoBiometrica)
    }

    function Logout(){
        setLogado(false)
    }


    return(
        <AuthContext.Provider value={{ Login, Logout, logado }}>
            { children }
        </AuthContext.Provider>
    )
}