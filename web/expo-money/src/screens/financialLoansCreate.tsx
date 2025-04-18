import { Dimensions, TouchableOpacity, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { textColorPrimary } from "../constants/colorsPalette "
import InputText from "../components/inputText"
import { useEffect, useState } from "react"
import ButtonComponent from "../components/button"
import DropDow from "../components/dropdow"
import { CustomerDTO } from "../types/customerDTO"
import api from "../integration/axiosconfig"

const FinancialLoansCreate = () => {

    const [simulator, setSimulator] = useState<boolean>(true)
    const [customerDTO, setCustomerDTO] = useState<CustomerDTO[]>([])
    const [filter, setFilter] = useState<string>("")
    const [showDropdow, setShowDropDow] = useState<boolean>(false)
    const [customerId, setCustomerId] = useState<string>("")

    const width = Dimensions.get("window").width

    useEffect(() => {
        if(filter.length === 0) {
            setCustomerDTO([])
            setShowDropDow(false)
            return
        }
        setShowDropDow(true)
        api.post("/customer/filterByNome", filter).then((response) => {
            if(response.data.length === 0) {setShowDropDow(false)}
            setCustomerDTO(response.data)
        })
    },[filter])

    return(
        <BaseScreens title=" ">
            <View style={{ width: width, alignItems:"center", gap: 20, padding: 20 }}>
                <TextComponent text="Criando Empréstimo" color={textColorPrimary} fontSize={20} textAlign={"auto"} />
                
                <InputText 
                    label="Cliente *" 
                    value={filter}
                    width={330}
                    onChangeText={(text) => setFilter(text) }
                />
                <DropDow display={showDropdow ? "flex" : "none"} width={330} top={139}> 
                    <View style={{ gap: 10, padding: 10}}>
                        {customerDTO && customerDTO.map((item, key) => (
                            <TouchableOpacity 
                                onPress={() => { setShowDropDow(false), setFilter(item.firsName + " " + item.lastName), setCustomerId(item.id)}}
                            >
                                <TextComponent key={key.toString()} text={item.firsName + " " + item.lastName} color={"rgb(36, 36, 36)"} fontSize={20} textAlign={"auto"} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </DropDow>

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