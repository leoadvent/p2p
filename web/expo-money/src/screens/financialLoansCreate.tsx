import { Dimensions, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { textColorPrimary } from "../constants/colorsPalette "
import InputText from "../components/inputText"
import { useState } from "react"
import ButtonComponent from "../components/button"

const FinancialLoansCreate = () => {

    const [simulator, setSimulator] = useState<boolean>(true)

    const width = Dimensions.get("window").width

    return(
        <BaseScreens title=" ">
            <View style={{ width: width, alignItems:"center", gap: 20, padding: 20 }}>
                <TextComponent text="Criando Empréstimo" color={textColorPrimary} fontSize={20} textAlign={"auto"} />
                
                <View style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "center"}}>

                    <InputText 
                        label="Valor *" 
                        money={true}
                        keyboardType="numeric"
                        value={""}
                        width={150}
                        onChangeText={() => {}}
                    />

                    <InputText 
                        label="Juros Empréstimo *" 
                        keyboardType="numeric"
                        value={""}
                        width={150}
                        onChangeText={() => {}}
                    />

                </View>

                <View style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "center"}}>
                    <InputText 
                        label="Juros Atraso *" 
                        keyboardType="numeric"
                        value={""}
                        width={150}
                        onChangeText={() => {}}
                    />

                    <InputText 
                        label="Adcional Dia Atraso *" 
                        keyboardType="numeric"
                        value={""}
                        width={150}
                        onChangeText={() => {}}
                    />
                </View>

                <View style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "flex-end"}}>
                    
                    <InputText 
                        label="Quantidade Parcelas *" 
                        keyboardType="numeric"
                        value={""}
                        width={150}
                        onChangeText={() => {}}
                    />

                    <ButtonComponent 
                        nameButton={simulator ? "SIMULANDO" : "EMPRESTIMO"} 
                        onPress={()=> {setSimulator(!simulator)} } 
                        typeButton={ simulator ? "primary" : "success"} 
                        width={"40%"} 
                    />
                </View>
            </View>
        </BaseScreens>
    )
}
export default FinancialLoansCreate