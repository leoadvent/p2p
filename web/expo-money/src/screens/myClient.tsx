import { Dimensions, FlatList, TouchableOpacity, View } from "react-native"
import BaseScreens from "./BaseScreens"
import { CustomerDTO } from "../types/customerDTO"
import { useEffect, useState } from "react"
import api from "../integration/axiosconfig"
import TextComponent from "../components/text/text"
import { backgroundPrimary, flatListBorderColor, textColorError, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import { Ionicons } from "@expo/vector-icons"
import { stylesGlobal } from "../constants/styles"
import { useFocusEffect } from '@react-navigation/native' 
import React from "react"
import InputText from "../components/inputText"


const MyClient = ({ navigation }:any) => {

    const [customerDTOFilter, setCustomerDTOFilter] = useState<CustomerDTO>({} as CustomerDTO)
    const [customersDTO, setCustomersDTO] = useState<CustomerDTO[]>([] as CustomerDTO[])

    const width = Dimensions.get("window").width;

    useFocusEffect(
        React.useCallback(() => {
            // Esse código será executado sempre que a tela for focada
            api.post("/customer/filter", customerDTOFilter).then((response) => {
                console.log("Clientes: ", response.data)
                setCustomersDTO(response.data.content)
            }).catch((error) => {
                console.error("Erro ao buscar clientes: ", error)
            }).finally(() => {
                console.log("Clientes: ", customersDTO)
            })
        }, [customerDTOFilter]) // Dependência para que a busca aconteça quando o filtro mudar
    )

    return(
        <BaseScreens backgroundColor={backgroundPrimary}  title=" " showChildrenParan={true} childrenParam={
            <View style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                width: width,
            }}>
                <InputText label={"Nome"} editable={true}
                    width={width-50}
                    placeholder="Filtro Nome"
                    value={customerDTOFilter.firsName}
                    onChangeText={(text) => {setCustomerDTOFilter({...customerDTOFilter, firsName: text})}}
                />
            </View>
        }>
            <View style={ [stylesGlobal.viewComponentBaseScree, {height: 600}]}>
                <FlatList 
                    data={customersDTO}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("FinanciamentoPendentePorCliente", {customerId: item.id })}
                        >
                            <View style={{ 
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: width-40, 
                                    borderWidth: 1, 
                                    marginBottom: 10,
                                    borderBottomColor: flatListBorderColor,
                                    borderRadius: 5,
                                    padding: 10,
                            }}>
                                <View style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    { item.amountFinancialLoans > 0 && <Ionicons name="ribbon-outline" size={8} color={textColorSuccess} />}
                                    { item.amountFinancialLoansOpen > 0 && <Ionicons name="ribbon-outline" size={8} color={textColorWarning} />}
                                    { item.amountFinancialLoansPending > 0 && <Ionicons name="ribbon-outline" size={8} color={textColorError} />}
                                </View>
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={16} text={item.firsName + " " + item.lastName } />
                                <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                   
                                    <TouchableOpacity onPress={() => navigation.navigate("CreateFinancial", {customer: item})}>
                                        <Ionicons name="cash" size={26} color={item.amountFinancialLoansOpen > 0 ? textColorError : textColorSuccess} />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity onPress={() => navigation.navigate("NewClient", { clientEdit: item })}>
                                        <Ionicons name="pencil-sharp" size={26} color={textColorWarning} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                
            </View>
        </BaseScreens>
    )
}
export default MyClient