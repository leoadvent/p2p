import { StyleSheet } from "react-native";
import { inputBorderColor, inputTextColor } from "./colorsPalette ";

export const stylesGlobal = StyleSheet.create({
    inputText: {
        height: 50,
        padding: 10,
        fontSize: 16,
        borderRadius: 10,
        color: inputTextColor,
        borderWidth: 1,
        borderColor: inputBorderColor,
    },
    viewComponentBaseScree: {
        display: "flex", 
        alignItems: "center", 
        width: "100%",
        flex: 1, 
        gap: 20, 
        padding: 10,
    }
})