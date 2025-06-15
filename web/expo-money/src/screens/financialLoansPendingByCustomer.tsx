import { Dimensions, FlatList, TouchableOpacity, View } from "react-native"
import { backgroundPrimary, flatListBackgroundColorpending, flatListBorderColor, textColorError, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { FinancialLoansPendingByCustumerDTO } from "../types/financialLoansPendingByCustumerDTO"
import api from "../integration/axiosconfig"
import { Ionicons } from "@expo/vector-icons"
import { stylesGlobal } from "../constants/styles"
import Contact from "../components/contact"

const FinancialLoansPendingByCustumer = ({ navigation }:any) => {

    const route = useRoute();
    const { customerId, financingTypeFilter } : any = route.params;

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
            <View style={ stylesGlobal.viewComponentBaseScree}>
                {Object.entries(financialPendingByCustomer).length > 0 &&
                    <View style={{ gap: 10, paddingTop: 10}}>
                        <TextComponent text={`${financialPendingByCustomer.customer.firsName} ${financialPendingByCustomer.customer.lastName}`} color={textColorPrimary} fontSize={18} textAlign={"center"}/>
                        <View style={{ gap: 10, paddingTop: 10, display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                           
                            <Contact phoneNumber={`${financialPendingByCustomer.customer.contact}`} /> 
                        </View>
                        <FlatList 
                            data={financialPendingByCustomer.loansPendingDTOS.filter((item) => {
                                if(financingTypeFilter === 'ALL') return true;
                                if(financingTypeFilter === 'OPEN') { return item.hasADelay === false && item.settled === false }
                                if(financingTypeFilter === 'LATE') { return item.hasADelay === true && item.settled === false }
                                if(item.executedPledge === false) { return}
                                return item.modalityFinancing.toString() === financingTypeFilter;
                            })}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate("FinanciamentoPendenteParcelasPorCliente", {financialLoasPaid: item.loansPaids, loansId: item.id, commitmentItems: item.commitmentItems})}}
                                >
                                    <View style={{ 
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                width: width-40, 
                                                borderWidth: 1, 
                                                marginBottom: 20,
                                                borderBottomColor: flatListBorderColor,
                                                borderRadius: 5,
                                                padding: 10,
                                                gap: 13,
                                                backgroundColor: item.hasADelay  ? flatListBackgroundColorpending : 'transparent'
                                        }}
                                    >
                                        <View style={{ display: "flex", flexDirection: "row", width: '100%', justifyContent: "flex-start", gap: 20, alignItems: "center"}}>
                                            <Ionicons name="flag-outline" size={14} color={item.totalInstallmentPending > 0 ? textColorError : textColorWarning} /> 
                                            <TextComponent text={`${item.modalityFinancingFormating}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="bag-outline" size={14} color={item.totalInstallmentPending > 0 ? textColorError : textColorWarning} /> 
                                            <TextComponent text={`Tem Garantia? ${item.commitmentItems.length > 0 ? "Sim" : "Não"}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems: "center"}}>
                                            <Ionicons name="ribbon-outline" size={14} color={item.totalInstallmentPending > 0 ? textColorError : textColorWarning} />
                                            <TextComponent text={`Contrato: ${item.id.slice(0, item.id.indexOf('-'))}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="pricetag-outline" size={15} color={textColorWarning}/>
                                            <TextComponent text={`${item.rate}%`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            {item.modalityFinancing.toString() === 'FINANCING' && <>
                                                <Ionicons name="pricetag-outline" size={15} color={textColorError}/>
                                                <TextComponent text={`${item.lateInterest}%`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            </> }
                                            {item.modalityFinancing.toString() === 'ONEROUS_LOAN' && <>
                                                <Ionicons name="calendar-outline" size={15} color={textColorError}/>
                                                <TextComponent text={`${item.dateEndFinancialOnerousLoans}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            </> }
=
                                        </View>
                                        <View style={{ display: item.modalityFinancing.toString() === 'FINANCING' ? "flex" : "none", flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems: "center"}}>
                                            <Ionicons name="return-up-forward-outline" size={15} color={textColorWarning}/>
                                            <TextComponent text={`${item.loansPaids.length} parcelas de ${item.loansPaids[0].installmentValueFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="return-up-forward-outline" size={15} color={textColorError}/>
                                            <TextComponent text={`Atraso: ${item.totalInstallmentPending}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems:"center"}}>
                                            <Ionicons name="cash" size={15} color={textColorSuccess}/>
                                            <TextComponent text={`${item.valueFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <TextComponent text={`${item.valueTotalFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                            <Ionicons name="wallet-outline" size={15} color={textColorError}/>
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