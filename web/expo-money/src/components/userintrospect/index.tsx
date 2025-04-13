import { TouchableOpacity, View } from "react-native"
import TextComponent from "./../text/text"
import { textColorPrimary } from "./../../constants/colorsPalette "
import React, { useContext } from "react"
import { AuthContext } from "./../../context/AuthContext"
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native"
import { NavigationProp } from "@/src/navigation/navigation"

const UserIntrospect = () => {

    const { userintrospect, logoutRealm } = useContext(AuthContext)

    const navigation = useNavigation<NavigationProp>();

    const timestamp = userintrospect.exp * 1000; // converte para milissegundos
    const data = new Date(timestamp);
    const dataFormatada = data.toLocaleString("pt-BR"); // ou outro formato que preferir
    
    return(
        <View 
            style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
            }}
            >
            <View style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start"}}>
                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={14} text={`Olá, ${userintrospect.given_name}.`} />
                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={14} text={`e-mail: ${userintrospect.email}`} />
                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={10} text={`Login validade: ${dataFormatada}`} />
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 20, alignItems: "center", paddingLeft: 10}}>
                <FontAwesome6 name="user-gear" size={24} color="yellow" />
                <TouchableOpacity onPress={() => {logoutRealm(), navigation.navigate("Login")}}>
                    <Ionicons name="exit-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default UserIntrospect