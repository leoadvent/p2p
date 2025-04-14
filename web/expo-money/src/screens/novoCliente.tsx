import BaseScreens from "./BaseScreens";
import TextComponent from "../components/text/text";
import { View } from "react-native";

const NovoCliente = () => {

    return (
        <BaseScreens title="" >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TextComponent text="Texte" color="rgb(240, 174, 174)" fontSize={10} textAlign="auto"/>
            </View>
        </BaseScreens>
    )
}
export default NovoCliente;