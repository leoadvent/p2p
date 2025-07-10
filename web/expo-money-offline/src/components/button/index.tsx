import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { buttonBackgroundColorDisabled, buttonBackgroundColorError, buttonBackgroundColorPrimary, buttonBackgroundColorSecondary, buttonBackgroundColorSuccess, buttonBackgroundColorWarning, textColorPrimary, textColorSecondary } from "../../constants/colorsPalette ";
import TextComponent from "../text/text";

interface Props {
    nameButton: string
    onPress: () => void
    isSpinner?: boolean
    isDisabled?: boolean
    typeButton: "primary" | "secondary" | "warning" | "success" | "error"
    width: number | "auto"
    height?: number
}

const ButtonComponent = ({ nameButton, onPress, typeButton, isDisabled, isSpinner, width, height } : Props ) => {
    
    const[backgroundButton, setBackgroundButton] = useState<string>(buttonBackgroundColorPrimary);
    const[colorTextBlack, setColorTextBlack] = useState<boolean>(false);

    function handlerColorButton() {
        switch (typeButton) {
            case "primary":
                setBackgroundButton(buttonBackgroundColorPrimary);
                setColorTextBlack(false);
                break;
            case "secondary":
                setBackgroundButton(buttonBackgroundColorSecondary);
                setColorTextBlack(true);
                break;
            case "warning":
                setBackgroundButton(buttonBackgroundColorWarning);
                setColorTextBlack(true);
                break
            case "success":
                setBackgroundButton(buttonBackgroundColorSuccess);
                setColorTextBlack(false);
                break
            case "error":
                setBackgroundButton(buttonBackgroundColorError);
                setColorTextBlack(false);
                break;
            default:
                setBackgroundButton(buttonBackgroundColorPrimary);
                setColorTextBlack(false);
                break;
        }
    }

    useEffect(() => {
        handlerColorButton();
    })

    return(
        <View style={{ display:"flex", width: width, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity
                onPress={isDisabled ? ()=>{} : onPress}
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: width,
                    height: height ? height : 45,
                    gap: 10,
                    backgroundColor: isDisabled ? buttonBackgroundColorDisabled : backgroundButton,
                    opacity: isDisabled ? 0.5 : 1,
                    padding: 10,
                    borderRadius: 5,
                    
                }}    
            >
                <ActivityIndicator style={{ display: isSpinner ? "flex": "none" }}/>
                <TextComponent 
                    fontSize={14} 
                    text={nameButton} 
                    fontWeight="700" 
                    textAlign="center" 
                    color={colorTextBlack ? textColorSecondary : textColorPrimary}
                />
            </TouchableOpacity>
        </View>
    )
}
export default ButtonComponent;