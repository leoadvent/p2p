import { borderCollor, textColorError, textColorPlaceholder, textColorPrimary } from "@/constants/colorsPalette ";
import { stylesGlobal } from "@/constants/styles";
import { KeyboardType, TextInput, View } from "react-native";
import TextComponent from "../text/text";

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
    percentage?: boolean,
    phone?: boolean,
    cep?: boolean,
    editable: boolean
    display? : "none" | "flex"
  }

const InputText = ({ value, placeholder, width, label, money, onChangeText, keyboardType, isPassword, inputError, editable, display, percentage, phone, cep } : Props) => {

    const formatCep = (value: string): string => {
        // Remove caracteres que não são dígitos
        let numericValue = value.replace(/[^0-9]/g, "");

        numericValue = numericValue.substring(0, 9);

        if( numericValue.length < 5) {
            return numericValue;
          }

        // Formata o CEP (ex: 12345-678)
        numericValue = numericValue.replace(/(\d{5})(\d{3})/, "$1-$2");
        return numericValue;
    }
   const formatPhone = (value: string): string => {
      // Remove tudo que não for número
      let numericValue = value.replace(/\D/g, "");

      // Limita a 11 dígitos (DDD + número)
      numericValue = numericValue.substring(0, 11);

      // Celular com 9 dígitos
      if (numericValue.length > 10) {
          return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      }

      // Telefone fixo com 8 dígitos
      if (numericValue.length > 6) {
          return numericValue.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      }

      // Parcial (exibindo DDD ou número sendo digitado)
      if (numericValue.length > 2) {
          return numericValue.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      }

      return numericValue;
  };
    const formatMoney = (value: string): string => {
        // Remove caracteres que não são dígitos
        let numericValue = value.replace(/[^0-9]/g, "");
    
        // Formata o número como moeda (R$ 1.234,56)
        numericValue = (Number(numericValue) / 100).toFixed(2).replace(".", ",");
    
        // Adiciona os pontos de milhar
        numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
        return numericValue;
      };

      const formatPorcentage = (value: string): string => {
        // Remove caracteres que não são dígitos
        let numericValue = value.replace(/[^0-9]/g, "");
    
        // Formata o número como porcentagem (1.234,56%)
        numericValue = (Number(numericValue) / 100).toFixed(2).replace(".", ",");
    
        // Adiciona os pontos de milhar
        numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
        return numericValue + "%";
      }

    const handleChangeText = (text: string) => {
        if (money && onChangeText) {
          // Formata o valor como moeda e chama a função de atualização
          onChangeText(formatMoney(text));
        } else if (percentage && onChangeText) {
          // Formata o valor como porcentagem e chama a função de atualização
          onChangeText(formatPorcentage(text));
        } else if (phone && onChangeText) {
          // Formata o valor como telefone e chama a função de atualização
          onChangeText(formatPhone(text));
        } else if (cep && onChangeText) {
          // Formata o valor como CEP e chama a função de atualização
          onChangeText(formatCep(text));            
        } else if (onChangeText) {
          // Apenas chama a função de atualização sem formatação
          onChangeText(text);
        }
      };

    return (    
        <View style={{ width: width, display: display === undefined ? "flex" : display}}>
            <TextComponent color={inputError ? textColorError : textColorPrimary} fontSize={12} text={label} textAlign="left" />
            <TextInput 
                editable={editable}
                value={value} 
                placeholder={placeholder}
                placeholderTextColor={textColorPlaceholder}
                onChangeText={handleChangeText}
                style={
                  [stylesGlobal.inputText, 
                    {
                      borderColor: inputError ? textColorError : borderCollor, 
                      borderWidth: 1, 
                      width: width, 
                      backgroundColor: editable ? "rgb(255, 255, 255)" : "rgb(182, 180, 180)"}]}
                keyboardType={keyboardType}
                secureTextEntry={isPassword}
            />
        </View>
    )
}
export default InputText