import { backgroundOpacityBallon, borderCollor } from "@/src/constants/colorsPalette ";
import React from "react";
import { View } from "react-native";

interface Props {
    children: React.ReactNode;
    backgroundColor: typeof backgroundOpacityBallon | 'transparent'
    borderWidth: 0.7 | 1
}
const BalaoTexto = ({children, backgroundColor, borderWidth} : Props) => {
    return (
        <View 
            style={{ 
                display:"flex", 
                flexDirection:"column", 
                gap:5, 
                alignItems:"center", 
                backgroundColor: backgroundColor, 
                borderRadius: 8, borderColor:borderCollor, borderWidth: borderWidth, padding:13}}>
                    {children}
        </View>
    )
}

export default BalaoTexto;