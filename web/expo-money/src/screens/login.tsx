import { View, TouchableOpacity } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { backgroundPrimary, textColorPrimary } from "../constants/colorsPalette "
import InputText from "../components/inputText"

const Login = ({ navigation }:any) => {
    return (
        <BaseScreens backgroundColor={backgroundPrimary} title="LOGIN">
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}  
            >
                <InputText  />
                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={18} text={"Login"} />
                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={18} text="Welcome to the login screen!"/>
                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={18} text="Login" />
                <TouchableOpacity onPress={() => navigation.navigate("MyTabs")}>
                    <TextComponent textAlign="auto" color={textColorPrimary} fontSize={18} text="Go to Home" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("newRealm")}>
                    <TextComponent textAlign="auto" color={textColorPrimary} fontSize={18} text="Novo Usuário" />
                </TouchableOpacity>
            </View>
        </BaseScreens>
    )
}
export default Login