import { stylesGlobal } from "@/src/constants/styles";
import { Dispatch, SetStateAction } from "react";
import { KeyboardType, TextInput, View } from "react-native"
import TextComponent from "../text/text";
import { textColorError, textColorPrimary } from "@/src/constants/colorsPalette ";

interface Props {
    label: string;
    labelColor?: typeof textColorPrimary | typeof textColorPrimary
    inputError?: boolean;
    labelBottom?: string;
    borderWidth?: number;
    value?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    icon?: any;
    isPassword?: boolean;
    isInteger?: boolean;
    keyboardType?: KeyboardType,
    width?: number,
    money?: boolean,
    editable: boolean
  }

const InputText = ({ value, placeholder, width, label, money, onChangeText, keyboardType, isPassword, inputError, editable } : Props) => {

    const formatMoney = (value: string): string => {
        // Remove caracteres que não são dígitos
        let numericValue = value.replace(/[^0-9]/g, "");
    
        // Formata o número como moeda (R$ 1.234,56)
        numericValue = (Number(numericValue) / 100).toFixed(2).replace(".", ",");
    
        // Adiciona os pontos de milhar
        numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
        return numericValue;
      };

    const handleChangeText = (text: string) => {
        if (money && onChangeText) {
          // Formata o valor como moeda e chama a função de atualização
          onChangeText(formatMoney(text));
        } else if (onChangeText) {
          // Apenas chama a função de atualização sem formatação
          onChangeText(text);
        }
      };

    return (    
        <View style={{ width: width}}>
            <TextComponent color={inputError ? textColorError : textColorPrimary} fontSize={12} text={label} textAlign="left" />
            <TextInput 
                editable={editable}
                value={value} 
                placeholder={placeholder}
                placeholderTextColor="#000000"
                onChangeText={handleChangeText}
                style={
                  [stylesGlobal.inputText, 
                    {
                      borderColor: inputError ? textColorError : "#000000", 
                      borderWidth: 2, width: width, 
                      backgroundColor: editable ? "rgb(255, 255, 255)" : "rgb(182, 180, 180)"}]}
                keyboardType={keyboardType}
                secureTextEntry={isPassword}
            />
        </View>
    )
}
export default InputText