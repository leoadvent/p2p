import { backgroundBlue, backgroundOpacityBallon, backgroundWarning, borderCollor } from "@/src/constants/colorsPalette ";
import React from "react";
import { View } from "react-native";

interface Props {
    children: React.ReactNode;
    backgroundColor: typeof backgroundOpacityBallon | typeof backgroundWarning | typeof backgroundBlue |'transparent'
    borderWidth: 0 | 0.7 | 1
    width?: number 
    height?: number
}
const BalaoTexto = ({children, backgroundColor, borderWidth, width, height} : Props) => {
    return (
        <View 
            style={{ 
                display:"flex", 
                flexDirection:"column", 
                width: width ?? "auto",
                height: height ?? "auto",
                gap:5, 
                alignItems:"center", 
                backgroundColor: backgroundColor, 
                borderRadius: 8, borderColor:borderCollor, borderWidth: borderWidth, padding:13}}>
                    {children}
        </View>
    )
}

export default BalaoTexto;