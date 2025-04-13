import { StyleSheet } from "react-native";
import { inputBackgroundColor, inputBorderColor, inputTextColor } from "./colorsPalette ";

export const stylesGlobal = StyleSheet.create({
    inputText: {
        height: 50,
        padding: 10,
        fontSize: 16,
        borderRadius: 10,
        backgroundColor: inputBackgroundColor,
        color: inputTextColor,
        borderWidth: 1,
        borderColor: inputBorderColor,
    }
})