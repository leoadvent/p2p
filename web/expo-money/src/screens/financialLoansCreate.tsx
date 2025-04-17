import { Dimensions, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { textColorPrimary } from "../constants/colorsPalette "

const FinancialLoansCreate = () => {

    const width = Dimensions.get("window").width

    return(
        <BaseScreens title=" ">
            <View style={{ height: 600, width: width, justifyContent: "center", alignItems: "center", gap: 20, padding: 20 }}>
                <TextComponent text="Criando Empréstimo" color={textColorPrimary} fontSize={20} textAlign={"auto"} />
            </View>
        </BaseScreens>
    )
}
export default FinancialLoansCreate