import { Dimensions, FlatList, TouchableOpacity, View } from "react-native"
import { backgroundPrimary, flatListBorderColor, textColorError, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { FinancialLoansPendingByCustumerDTO } from "../types/financialLoansPendingByCustumerDTO"
import api from "../integration/axiosconfig"
import { Ionicons } from "@expo/vector-icons"

const FinancialLoansPendingByCustumer = ({ navigation }:any) => {

    const route = useRoute();
    const { customerId } : any = route.params;

    const width = Dimensions.get("window").width;

    const [financialPendingByCustomer, setFinancialPendingByCustomer] = useState<FinancialLoansPendingByCustumerDTO>({} as FinancialLoansPendingByCustumerDTO)

    useEffect(() => {

        api.get(`/financial/findByLoansPendingByCustomer/${customerId}`).then((response) => {
            setFinancialPendingByCustomer(response.data)
        }).catch((error) => {
            alert(error)
        })

    },[customerId])

    
    return(
        <BaseScreens backgroundColor={backgroundPrimary} title="EMPRÉSTIMOS PENDENTES" rolbackStack>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
            }}>
                {Object.entries(financialPendingByCustomer).length > 0 &&
                    <View style={{ gap: 10, paddingTop: 10}}>
                        <TextComponent text={`${financialPendingByCustomer.customer.firsName} ${financialPendingByCustomer.customer.lastName}`} color={textColorPrimary} fontSize={18} textAlign={"center"}/>
                        <View style={{ gap: 10, paddingTop: 10, display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                            <Ionicons name="call-outline" size={15} color={textColorWarning}/>
                            <TextComponent text={`${financialPendingByCustomer.customer.contact}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                        </View>
                        <FlatList 
                            data={financialPendingByCustomer.loansPendingDTOS}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate("FinanciamentoPendenteParcelasPorCliente", {financialLoasPaid: item.loansPaids})}}
                                >
                                    <View style={{ 
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                width: width-40, 
                                                borderWidth: 1, 
                                                marginBottom: 10,
                                                borderBottomColor: flatListBorderColor,
                                                borderRadius: 5,
                                                padding: 10,
                                                gap: 10
                                        }}
                                    >
                                        <View style={{ display: "flex", flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems: "center"}}>
                                            <Ionicons name="ribbon-outline" size={14} color={item.totalInstallmentPending > 0 ? textColorError : textColorWarning} />
                                            <TextComponent text={`Contrato: ${item.id.slice(0, item.id.indexOf('-'))}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="pricetag-outline" size={15} color={textColorWarning}/>
                                            <TextComponent text={`${item.rate}%`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="pricetag-outline" size={15} color={textColorError}/>
                                            <TextComponent text={`${item.lateInterest}%`} color={textColorPrimary} fontSize={14} textAlign={"center"} />

                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems: "center"}}>
                                            <Ionicons name="return-up-forward-outline" size={15} color={textColorWarning}/>
                                            <TextComponent text={`${item.loansPaids.length} parcelas de ${item.loansPaids[0].installmentValueFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="return-up-forward-outline" size={15} color={textColorError}/>
                                            <TextComponent text={`Atraso: ${item.totalInstallmentPending}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems:"center"}}>
                                            <Ionicons name="cash" size={15} color={textColorSuccess}/>
                                            <TextComponent text={`${item.valueFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <TextComponent text={`${item.valueTotalFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="calendar-number" size={15} color={textColorError}/>
                                            <TextComponent text={`${item.additionForDaysOfDelayFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                }
            </View>
        </BaseScreens>
    )
}
export default FinancialLoansPendingByCustumer