import { backgroundOpacityBallon, borderCollor } from "@/src/constants/colorsPalette ";
import React from "react";
import { View } from "react-native";

interface Props {
    children: React.ReactNode;
}
const BalloonPayment = ({children} : Props) => {
    return (
        <View 
            style={{ 
                display:"flex", 
                flex:1,
                flexDirection:"column", 
                gap:5, 
                alignItems:"center", 
                backgroundColor: backgroundOpacityBallon, 
                borderRadius: 8, borderColor:borderCollor, borderWidth:0.7, padding:13}}>
                    {children}
        </View>
    )
}

export default BalloonPayment;