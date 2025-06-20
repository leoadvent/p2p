import { Dimensions, FlatList, TouchableOpacity, View, Image, ActivityIndicator  } from "react-native"
import BaseScreens from "./BaseScreens"
import { CustomerDTO } from "../types/customerDTO"
import { useState } from "react"
import api, { BASE_URL } from "../integration/axiosconfig"
import TextComponent from "../components/text/text"
import { backgroundPrimary, flatListBorderColor, textColorDeactivated, textColorError, textColorPrimary, textColorSecondary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import { Ionicons } from "@expo/vector-icons"
import { stylesGlobal } from "../constants/styles"
import { useFocusEffect } from '@react-navigation/native' 
import React from "react"
import InputText from "../components/inputText"
import ModalSystem from "../components/modal"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CustomerFilterDTO } from "../types/customerFilterDTO"
import ShowImageCustomer from "../components/showImageCustomer"


const MyClient = ({ navigation }:any) => {

    const [customerDTOFilter, setCustomerDTOFilter] = useState<CustomerDTO>({} as CustomerDTO)
    const [customerFilterDto, setCustomerFilterDto] = useState<CustomerFilterDTO[]>([] as CustomerFilterDTO[])
    const [totalCustomers, setTotalCustomers] = useState<number>(0)
    const [sizeByPage, setSizeByPage] = useState<number>(10)
    const [page, setPage] = useState<number>(0)
    const [totalPage, setTotalPage] = useState<number>();

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState<string>("")
    const [idCustomerModal, setIdCustomerModal] = useState<string>("")
    const [customerEditDTO, setCustomerEditDTO] = useState<CustomerFilterDTO>({} as CustomerFilterDTO)

    const width = Dimensions.get("window").width;

    useFocusEffect(
        React.useCallback(() => {
            api.post(`/customer/filter?page=${page}&size=${sizeByPage}&sort=firsName,asc`, customerDTOFilter).then((response) => {
                setTotalCustomers(response.data.totalElements)
                setTotalPage(response.data.totalPage)
                setCustomerFilterDto(response.data.content)
            }).catch((error) => {
                console.error("Erro ao buscar clientes: ", error)
            })
        }, [customerDTOFilter, sizeByPage])
    )

    function handlerOpenModal(title: string, idCustomer: string, customerEdit: CustomerFilterDTO) {
        setTitleModal(title)
        setIsModalVisible(!isModalVisible)
        setIdCustomerModal(idCustomer)
        setCustomerEditDTO(customerEdit)
    }

    function HandlerShowImage( urlPhoto: string, amountFinancialLoansPending: number, width: number = 80, height: number = 80) {
        
        if (urlPhoto == null || urlPhoto === "") {
            return 
        }

        const realm = AsyncStorage.getItem("realmName");
        console.log("URL FOTO: ", `${BASE_URL}/minio/download/${realm}/${urlPhoto}`)
        return (
            <Image 
                source={{ uri: `${BASE_URL}/minio/download/realm-mauricio-nassau/${urlPhoto}` }} 
                style={{ width: width, height: height, borderRadius:80, borderWidth:2,  borderColor: amountFinancialLoansPending > 0 ? textColorError : textColorDeactivated  }}/>
        )
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
                     data={
                            [...customerFilterDto]
                            .sort((a, b) => {
                                const aHasPending = a.amountFinancialLoansPending > 0 ? 1 : 0;
                                const bHasPending = b.amountFinancialLoansPending > 0 ? 1 : 0;
                                if (bHasPending !== aHasPending) {
                                return bHasPending - aHasPending;
                                }

                                if (b.amountFinancialLoansPending !== a.amountFinancialLoansPending) {
                                return b.amountFinancialLoansPending - a.amountFinancialLoansPending;
                                }

                                return a.firsName.localeCompare(b.firsName);
                            })
                        }
                    onEndReached={() => {setSizeByPage(sizeByPage + 10)}}
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
                                    <View style={{ display: "flex", flexDirection: "column", gap: 5, justifyContent:"center", width:25 }}>
                                        { item.amountFinancialLoans > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorSuccess} />}
                                        { item.amountFinancialLoansOpen > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorWarning} />}
                                        { item.amountFinancialLoansPending > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorError} />}
                                        { item.amountFinancialLoansExecutedPledge > 0 && <Ionicons name="ribbon-outline" size={14} color={textColorDeactivated} />}
                                    </View>
                                    <ShowImageCustomer 
                                        urlPhoto={item.urlPhoto} 
                                        amountFinancialLoansPending={item.amountFinancialLoansPending} 
                                        firsName={item.firsName}
                                        lastName={item.lastName}
                                        width={80}
                                        height={80}
                                    />
                                    
                                </View>
                                <View style={{ display:'flex', flexDirection:'column', justifyContent:"center", marginRight: 15 }}>
                                    <TextComponent textAlign="center" color={item.amountFinancialLoansPending > 0 ? textColorError : textColorPrimary} fontSize={24} text={item.firsName} />
                                    <TextComponent textAlign="center" color={item.amountFinancialLoansPending > 0 ? textColorError : textColorPrimary} fontSize={12} text={item.lastName } />
                                </View>
                                                               
                            </View>
                        </TouchableOpacity>
                    )}
                />
                
            </View>
            <ModalSystem title={`${titleModal}`} heightProp={850} children={
                <View style={{ display: "flex", flexDirection: "column", gap: 10, alignItems:"center" }}>

                    <ShowImageCustomer
                        urlPhoto={customerEditDTO.urlPhoto}
                        amountFinancialLoansPending={customerEditDTO.amountFinancialLoansPending}
                        firsName={customerEditDTO.firsName}
                        lastName={customerEditDTO.lastName}
                        width={160}
                        height={160}
                    />
                                      
                  
                    <TouchableOpacity style={{ 
                        gap: 4, 
                        backgroundColor: backgroundPrimary,padding: 10, borderRadius: 5, width: width - 120 }}
                        onPress={() => {setIsModalVisible(false), navigation.navigate("FinanciamentoPendentePorCliente", {customerId: idCustomerModal, financingTypeFilter: "ALL"})}}
                    >  
                        <View style={{ display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between" }}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="ribbon-outline" size={26} color={textColorSuccess} />
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`Emprétismo Ativos`} />
                            </View>
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`${Object.entries(customerEditDTO).length > 0 ? customerEditDTO.amountFinancialLoansOpen + customerEditDTO.amountFinancialLoansPending : ""}`} />
                        </View>
                    </TouchableOpacity>

                    {/*
                    <TouchableOpacity style={{ 
                        gap: 4, 
                        backgroundColor: backgroundPrimary,padding: 10, borderRadius: 5, width: width - 120 }}
                        onPress={() => {setIsModalVisible(false), navigation.navigate("FinanciamentoPendentePorCliente", {customerId: idCustomerModal, financingTypeFilter: "OPEN"})}}
                    >  
                        <View style={{ display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between" }}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="ribbon-outline" size={26} color={textColorWarning} />
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`Emprétismo Aberto`} />
                            </View>
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`${Object.entries(customerEditDTO).length > 0 ? customerEditDTO.amountFinancialLoansOpen.toString() : ""}`} />
                        </View>
                    </TouchableOpacity>
                     */}
                    <TouchableOpacity style={{ 
                        gap: 4, 
                        backgroundColor: backgroundPrimary,padding: 10, borderRadius: 5, width: width - 120 }}
                        onPress={() => {setIsModalVisible(false), navigation.navigate("FinanciamentoPendentePorCliente", {customerId: idCustomerModal, financingTypeFilter: "LATE"})}}
                    > 
                        <View style={{ display: "flex", flexDirection: "row", gap: 10 , justifyContent: "space-between"}}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="ribbon-outline" size={26} color={textColorError} />
                                <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`Emprétismo Atrasado`} />
                            </View>
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={12} text={`${Object.entries(customerEditDTO).length > 0 ? customerEditDTO.amountFinancialLoansPending.toString(): ""}`} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ 
                        gap: 4, 
                        backgroundColor: backgroundPrimary,padding: 10, borderRadius: 5, width: width - 120 }}
                        onPress={() => {setIsModalVisible(false), navigation.navigate("ExecutedPledgeByCustomer", { nameCustomer: `${customerEditDTO.firsName} ${customerEditDTO.lastName}`, idCustomer: customerEditDTO.id })}}
                    > 
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