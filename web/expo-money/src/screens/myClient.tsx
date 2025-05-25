import { Dimensions, FlatList, TouchableOpacity, View, Image } from "react-native"
import BaseScreens from "./BaseScreens"
import { CustomerDTO } from "../types/customerDTO"
import { useEffect, useState } from "react"
import api from "../integration/axiosconfig"
import TextComponent from "../components/text/text"
import { backgroundPrimary, flatListBorderColor, textColorDeactivated, textColorError, textColorPrimary, textColorSecondary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
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
    const [sizeByPage, setSizeByPage] = useState<number>(10)
    const [page, setPage] = useState<number>(0)
    const [totalPage, setTotalPage] = useState<number>();

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState<string>("")
    const [idCustomerModal, setIdCustomerModal] = useState<string>("")
    const [customerEditDTO, setCustomerEditDTO] = useState<CustomerDTO>({} as CustomerDTO)

    const width = Dimensions.get("window").width;

    useFocusEffect(
        React.useCallback(() => {
            api.post(`/customer/filter?page=${page}&size=${sizeByPage}&sort=firsName,asc`, customerDTOFilter).then((response) => {
                setTotalCustomers(response.data.totalElements)
                setTotalPage(response.data.totalPage)
                setCustomersDTO(response.data.content)
            }).catch((error) => {
                console.error("Erro ao buscar clientes: ", error)
            }).finally(() => {
                console.log("Clientes: ", customersDTO)
            })
        }, [customerDTOFilter, sizeByPage])
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
            <View style={ [stylesGlobal.viewComponentBaseScree, { height:10}]}>
                <FlatList 
                    data={[...[...customersDTO].sort((a, b) => b.amountFinancialLoansPending - a.amountFinancialLoansPending)].sort((a, b) => b.amountFinancialLoansOpen - a.amountFinancialLoansOpen)}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => {
                        if(sizeByPage < totalCustomers){
                            setSizeByPage((prev) => prev + 10)
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handlerOpenModal(`${item.firsName} ${item.lastName}`, item.id, item)}
                        >
                            <View style={{ 
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    gap: 20,
                                    width: width-40, 
                                    borderWidth: 1, 
                                    marginBottom: 10,
                                    borderBottomColor: flatListBorderColor,
                                    borderRadius: 5,
                                    padding: 10,
                            }}>
                                <View style={{display: "flex", flexDirection:"row", gap:10}}>
                                    <View style={{ display: "flex", flexDirection: "column", gap: 5, justifyContent:"center" }}>
                                        { item.amountFinancialLoans > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorSuccess} />}
                                        { item.amountFinancialLoansOpen > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorWarning} />}
                                        { item.amountFinancialLoansPending > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorError} />}
                                        { item.amountFinancialLoansExecutedPledge > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorDeactivated} />}
                                    </View>
                                    {item.urlPhoto != null &&
                                        <Image source={{ uri: `http://192.168.166.96:8080/customer/photo/${item.urlPhoto}` }} style={{ width: 85, height: 85, borderRadius:50, borderWidth:2, borderColor: item.amountFinancialLoansPending > 0 ? textColorError : textColorDeactivated }}/>
                                    }
                                    {item.urlPhoto == null &&
                                        <View style={{ width: 85, height: 85, borderRadius:50, borderWidth:2, backgroundColor:  item.amountFinancialLoansPending > 0 ? textColorError : textColorSecondary, borderColor:'rgb(18, 93, 179)', alignContent:"center", alignItems:"center", justifyContent:"center" }}>
                                            <TextComponent text={`${item.firsName.charAt(0)}${item.lastName.charAt(0)}`} color={"rgb(255, 255, 255)"} fontSize={22} textAlign={"center"} />
                                        </View>
                                    }
                                </View>
                                <View style={{ display:'flex', flexDirection:'column', justifyContent:"center" }}>
                                    <TextComponent textAlign="center" color={textColorPrimary} fontSize={18} text={item.firsName} />
                                    <TextComponent textAlign="center" color={textColorPrimary} fontSize={10} text={item.lastName } />
                                </View>
                                
                                <View style={{ display: "flex", flexDirection: "row", justifyContent:"center", alignItems:"center" }}>
                                    <TouchableOpacity onPress={() => {setIsModalVisible(false), navigation.navigate("CreateFinancial", {customer: item})}}>
                                        <Ionicons name="cash" size={35} color={item.amountFinancialLoansOpen > 0 ? textColorError : textColorSuccess} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                
            </View>
            <ModalSystem title={`${titleModal}`} heightProp={800} children={
                <View style={{ display: "flex", flexDirection: "column", gap: 10, alignItems:"center" }}>
                    {customerEditDTO.urlPhoto != null &&
                        <Image 
                            source={{ uri: `http://192.168.166.96:8080/customer/photo/${customerEditDTO.urlPhoto}` }} 
                            style={{ width: 160, height: 160, borderRadius:80, borderWidth:2,  borderColor: customerEditDTO.amountFinancialLoansPending > 0 ? textColorError : textColorDeactivated  }}/>
                    }
                    {customerEditDTO.urlPhoto == null && customerEditDTO.firsName != undefined &&
                        <View style={{ width: 130, height: 130, borderRadius:80, borderWidth:2, backgroundColor:  customerDTOFilter.amountFinancialLoansPending > 0 ? textColorError : textColorSecondary, borderColor:'rgb(18, 93, 179)', alignContent:"center", alignItems:"center", justifyContent:"center" }}>
                            <TextComponent text={`${customerEditDTO.firsName.charAt(0)}${customerEditDTO.lastName.charAt(0)}`} color={"rgb(255, 255, 255)"} fontSize={30} textAlign={"center"} />
                        </View>
                    }
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
                        <View style={{ display: "flex", flexDirection: "row", gap: 10 , justifyContent: "space-between"}}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="ribbon-outline" size={26} color={textColorDeactivated} />
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`Garantias Executadas`} />
                            </View>
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`${Object.entries(customerEditDTO).length > 0 ? customerEditDTO.amountFinancialLoansExecutedPledge : ""}`} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ display: "flex", marginTop: 30, flexDirection: "row", gap: 20, justifyContent: "space-evenly", width: "90%" }}>
                                   
                        <TouchableOpacity onPress={() => {setIsModalVisible(false), navigation.navigate("CustomerCommitment", {customerId: customerEditDTO.id})}}>
                            <Ionicons name="bag-outline" size={26} color={textColorSuccess} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {setIsModalVisible(false), navigation.navigate("ExecutedPledgeByCustomer", { nameCustomer: `${customerEditDTO.firsName} ${customerEditDTO.lastName}`, idCustomer: customerEditDTO.id })}}>
                            <Ionicons name="bag-check-outline" size={26} color={textColorDeactivated} />
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