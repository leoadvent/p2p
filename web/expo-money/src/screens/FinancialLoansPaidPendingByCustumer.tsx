import { Dimensions, FlatList, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { flatListBorderColor, textColorError, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import { useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { FinancialLoansPaid } from "../types/financialLoans"
import InputText from "../components/inputText"
import { Ionicons } from "@expo/vector-icons"

const FinancialLoansPaidPendingByCustumer = () => {

    const width = Dimensions.get("window").width;

    const route = useRoute();
    const { financialLoasPaid } : any = route.params;

    const [financialLoansPaid, setFinancialLoansPaid] = useState<FinancialLoansPaid[]>([])
    const [value, setValue] = useState<string>("")

    useEffect(() => {
        setFinancialLoansPaid(financialLoasPaid)
    },[financialLoasPaid])
    
    return(
        <BaseScreens title={"PARCELA EMPRÉSTIMO"} rolbackStack>
            <View style={{ 
                marginTop: 10,
                width: width, 
                alignItems:"center", 
                alignContent:"center",
                justifyContent:"center",
                gap: 20
            }}>

                {Object.entries(financialLoansPaid).length > 0 &&
                    <FlatList 
                        data={financialLoansPaid}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{ 
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: width-40, 
                                borderWidth: 1, 
                                marginBottom: 10,
                                borderBottomColor: flatListBorderColor,
                                borderRadius: 5,
                                padding: 10,
                                gap: 10
                                }}
                            >
                                <View style={{ display:"flex", flexDirection:"column"}}>
                                    <View style={{ display:"flex", flexDirection:"row", gap:10}}>
                                        <Ionicons name="pricetag-outline" size={15} color={textColorWarning}/>
                                        <TextComponent text={`${item.rate}%`} color={textColorPrimary} fontSize={10} textAlign={"auto"}/> 
                                        <Ionicons name="pricetag-outline" size={15} color={textColorError}/>
                                        <TextComponent text={`${item.interestDelay}%`} color={textColorPrimary} fontSize={10} textAlign={"auto"}/> 
                                        <Ionicons name="calendar-clear-outline" size={15} color={textColorError}/>
                                        <TextComponent text={`${item.additionForDaysOfDelayFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"}/> 
                                    </View>
                                    <View style={{ display:"flex", flexDirection:"row", gap:10}}>
                                        <Ionicons name="calendar-number-outline" size={15} color={item.lateInstallment ? textColorError : textColorSuccess}/>
                                        <TextComponent text={`${item.dueDate}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                                    </View>
                                    
                                    <TextComponent text={`Valor: ${item.installmentValueFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                                    <TextComponent text={`Valor Atual: ${item.currencyValueFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                                    <TextComponent text={`Valor Pago: ${item.amountPaidFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                                </View>
                                <InputText 
                                    editable
                                    label="Valor *" 
                                    money={true}
                                    keyboardType="numeric"
                                    width={150}
                                    value={value}
                                    onChangeText={(text) => setValue(text)}
                                />
                            </View>
                        )}
                    />
                }
            </View>
        </BaseScreens>
    )
}
export default FinancialLoansPaidPendingByCustumer