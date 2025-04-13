import { Image, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { backgroundPrimary, textColorPrimary } from "../constants/colorsPalette "
import ButtonComponent from "../components/button"
import InputText from "../components/inputText"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"

const Login = ({ navigation }:any) => {

    const [loginRealmClient, setLoginRealmClient] = useState<LoginRealmClient>({} as LoginRealmClient)
    const [isSpinner, setIsSpinner] = useState(false)

    const { recoveryRealm, realmName, loginRealm, accessTokenResponse, logado } = useContext(AuthContext)

    const handleLogin = () => {
        setIsSpinner(true)
        if(realmName === "") {
            recoveryRealm(loginRealmClient.username)
        }
        alert("Realm encontrado: " + realmName)

        const data: LoginRealmClient = { realm: realmName, username: loginRealmClient.username, password: loginRealmClient.password}
        
        loginRealm(data)
        setIsSpinner(false)

        console.log("Logado: ", logado)
        if(logado) {
            navigation.navigate("MyTabs")
        } else {
            alert("Erro ao realizar o login.")
        }

    }

    return (
        <BaseScreens backgroundColor={backgroundPrimary} title="LOGIN">
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 30,
                }}  
            >

                <Image source={require("../../assets/images/logo.png")}
                    style={{
                        height: 68,
                        width: 70,
                        alignSelf:"center",
                        objectFit:"fill"
                    }}
                />

                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={18} text={"Login"} />

                <InputText label="Username" placeholder="usuario@email.com" onChangeText={(text) =>setLoginRealmClient({...loginRealmClient, username: text})} width={300}/>
                <InputText label="Password" placeholder="senha" onChangeText={(text) => setLoginRealmClient({...loginRealmClient, password: text})} isPassword width={300}/>

                <View style={{ display: "flex", marginTop: 50, flexDirection: "row", gap: 10, width: "80%", justifyContent: "center", alignItems: "center"}}>
               
                    <ButtonComponent 
                        nameButton="LOGIN" 
                        typeButton="success" 
                        width="100%" 
                        onPress={() => handleLogin()} 
                        isSpinner={isSpinner} isDisabled={false}/>

                </View>        
                <View style={{ display: "flex", flexDirection: "row", gap: 10, width: "80%", justifyContent: "center", alignItems: "center"}}>
                    <ButtonComponent 
                        nameButton="NOVO USUÁRIO" 
                        typeButton="primary" 
                        width="100%" 
                        onPress={() => navigation.navigate("newRealm")} 
                        isSpinner={false} isDisabled={false}/>
                </View>

               
            </View>
        </BaseScreens>
    )
}
export default Login