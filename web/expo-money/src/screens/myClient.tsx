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
import ModalSystem from "../components/modal"


const MyClient = ({ navigation }:any) => {

    const [customerDTOFilter, setCustomerDTOFilter] = useState<CustomerDTO>({} as CustomerDTO)
    const [customersDTO, setCustomersDTO] = useState<CustomerDTO[]>([] as CustomerDTO[])
    const [totalCustomers, setTotalCustomers] = useState<number>(0)

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState<string>("")
    const [idCustomerModal, setIdCustomerModal] = useState<string>("")
    const [customerEditDTO, setCustomerEditDTO] = useState<CustomerDTO>({} as CustomerDTO)

    const width = Dimensions.get("window").width;

    useFocusEffect(
        React.useCallback(() => {
            // Esse código será executado sempre que a tela for focada
            api.post("/customer/filter", customerDTOFilter).then((response) => {
                setTotalCustomers(response.data.totalElements)
                setCustomersDTO(response.data.content)
            }).catch((error) => {
                console.error("Erro ao buscar clientes: ", error)
            }).finally(() => {
                console.log("Clientes: ", customersDTO)
            })
        }, [customerDTOFilter]) // Dependência para que a busca aconteça quando o filtro mudar
    )

    function handlerOpenModal(title: string, idCustomer: string, customerEdit: CustomerDTO) {
        setTitleModal(title)
        setIsModalVisible(!isModalVisible)
        setIdCustomerModal(idCustomer)
        setCustomerEditDTO(customerEdit)
    }

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
                <TextComponent text={`Total de clientes: ${totalCustomers}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
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
                            onPress={() => handlerOpenModal(`${item.firsName} ${item.lastName}`, item.id, item)}
                        >
                            <View style={{ 
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    gap: 40,
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
                                
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => {setIsModalVisible(false), navigation.navigate("CreateFinancial", {customer: item})}}>
                                        <Ionicons name="cash" size={26} color={item.amountFinancialLoansOpen > 0 ? textColorError : textColorSuccess} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            

                        </TouchableOpacity>
                    )}
                />
                
            </View>
            <ModalSystem title={`${titleModal}`} heightProp={500} children={
                <View style={{ display: "flex", flexDirection: "column", gap: 10, alignItems:"flex-start" }}>
                    <TouchableOpacity style={{ 
                        gap: 4, 
                        backgroundColor: backgroundPrimary,padding: 10, borderRadius: 5 }}
                        onPress={() => {setIsModalVisible(false), navigation.navigate("FinanciamentoPendentePorCliente", {customerId: idCustomerModal })}}
                    >  
                        <View style={{ display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between" }}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="ribbon-outline" size={26} color={textColorSuccess} />
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`Financiamentos Realizados`} />
                            </View>
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`${Object.entries(customerEditDTO).length > 0 ? customerEditDTO.amountFinancialLoans.toString() : ""}`} />
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between" }}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="ribbon-outline" size={26} color={textColorWarning} />
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`Financiamentos Aberto`} />
                            </View>
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`${Object.entries(customerEditDTO).length > 0 ? customerEditDTO.amountFinancialLoansOpen.toString() : ""}`} />
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", gap: 10 , justifyContent: "space-between"}}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="ribbon-outline" size={26} color={textColorError} />
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`Financiamentos Atrasado`} />
                            </View>
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`${Object.entries(customerEditDTO).length > 0 ? customerEditDTO.amountFinancialLoansPending.toString(): ""}`} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ display: "flex", marginTop: 30, flexDirection: "row", gap: 20, justifyContent: "space-evenly", width: "90%" }}>
                                   
                        <TouchableOpacity onPress={() => {setIsModalVisible(false), navigation.navigate("CustomerCommitment", {customerId: customerEditDTO.id})}}>
                            <Ionicons name="bag-outline" size={26} color={textColorSuccess} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {setIsModalVisible(false), navigation.navigate("CreateFinancial", {customer: customerEditDTO})}}>
                            <Ionicons name="cash" size={26} color={customerEditDTO.amountFinancialLoansOpen > 0 ? textColorError : textColorSuccess} />
                        </TouchableOpacity>
                                    
                        <TouchableOpacity onPress={() => {setIsModalVisible(false), navigation.navigate("NewClient", { clientEdit: customerEditDTO })}}>
                            <Ionicons name="pencil-sharp" size={26} color={textColorWarning} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            } setVisible={setIsModalVisible} visible={isModalVisible} />
        </BaseScreens>
    )
}
export default MyClient