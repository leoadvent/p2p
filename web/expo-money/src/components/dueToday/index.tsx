import BaseScreens from "@/src/screens/BaseScreens"
import { Dimensions, FlatList, View } from "react-native"
import TextComponent from "../text/text";
import { backgroundOpacity, flatListBorderColor, textColorPrimary, textColorWarning } from "@/src/constants/colorsPalette ";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CustomerDTO } from "@/src/types/customerDTO";
import api from "@/src/integration/axiosconfig";
import ButtonComponent from "../button";
import { CustomerDueToday } from "@/src/types/customerDueToday";
import { Ionicons } from "@expo/vector-icons";
import InputText from "../inputText";
import { FinancialLoansPaid } from "@/src/types/financialLoans";

interface Props{
    days: number
    dueTodayActive: number
    setDueTodayActive: Dispatch<SetStateAction<number>>
    idComponent: number
}
const DueToday = ({days, idComponent, dueTodayActive, setDueTodayActive} : Props) => {

    const width = Dimensions.get("screen").width;

    const [customerDueToday, setCustomerDueToday] = useState<CustomerDueToday[]>([])
    const [showDueToday, setShowCustomToday] = useState<boolean>(false)

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [paymentValue, setPaymentValue] = useState("");

    const [refresh, setRefresh] = useState<any>()

    const handlePayPress = async (item: FinancialLoansPaid) => {
        const amountPaid = parseFloat(paymentValue.replace(/\D/g, "")) / 100;
      
        const paid = { ...item, amountPaid };
      
        try {
            const paiding = await api.post('/financial/loansPaid', paid);
          
            setRefresh(paiding)
      
            alert("Pagamento registrado com sucesso!");
        } catch (error) {
            console.error(error)
            alert("Erro ao registrar pagamento");
        } finally {
            setEditingItemId(null);
            setPaymentValue("");
        }
      };

    useEffect(() => {
        api.get(`/financial/dueToday/${days}`).then((response) => {
            setCustomerDueToday(response.data)
        }).catch((error) => {
            alert(error)
        })
    },[refresh])

    return(
        <View style={{ 
            display: Object.entries(customerDueToday).length > 0 ? "flex": "none", 
            width: width-30, 
            justifyContent: "center", 
            alignItems: "center", 
            gap: 20, 
            padding: 20, 
            backgroundColor: showDueToday ? backgroundOpacity : "transparent",
            borderRadius: 10
        }}>
            <ButtonComponent 
                nameButton={`Vencendo ${days === 0 ? 'Hoje' : `em ${days} dias`} ${Object.entries(customerDueToday).length}`} 
                onPress={ ()=> {setShowCustomToday(!showDueToday), setDueTodayActive(idComponent)} } 
                typeButton={"primary"} 
                width={"100%"} 
            />
            <View style={{ display: showDueToday && idComponent==dueTodayActive ? "flex" : "none" }}>
                <FlatList 
                    data={customerDueToday}
                    keyExtractor={(item) => item.paid.id.toString()}
                    renderItem={({item}) => (
                        <View style={{ 
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            borderWidth: 1, 
                            marginBottom: 5,
                            width: width-70,
                            borderBottomColor: flatListBorderColor,
                            borderRadius: 5,
                            padding: 10,
                            gap: 10
                        }}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
                                <TextComponent text={`${item.firstname} ${item.lastName}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", gap: 3, justifyContent:"space-between", alignItems:"center" }}>
                                <Ionicons name="ribbon-outline" size={15} color={textColorWarning}/>
                                <TextComponent text={`Contrato: ${item.paid.id.slice(0, item.paid.id.indexOf('-'))}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                <Ionicons name="calendar-number-outline" size={15} color={textColorWarning}/>
                                <TextComponent text={`${item.paid.dueDate}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 , alignItems:"center"}}>
                                <Ionicons name="cash-outline" size={15} color={textColorWarning}/>
                                <TextComponent text={`${item.paid.currencyValueFormat}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                            </View>
                            <View style={{ display:item.paid.amountPaid === item.paid.currencyValue ? "none": "flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between", alignItems:"flex-end"}}>
                                <ButtonComponent 
                                    nameButton={editingItemId === item.paid.id ? "CONFIRMAR" : "PAGAR"} 
                                    onPress={() => editingItemId === item.paid.id ? handlePayPress(item.paid) : setEditingItemId(item.paid.id)} 
                                    typeButton={"primary"} 
                                    width={"40%"} 
                                />
                                {editingItemId === item.paid.id && (
                                    <InputText 
                                        editable
                                        label="" 
                                        placeholder="Valor"
                                        money={true}
                                        keyboardType="numeric"
                                        width={150}
                                        value={paymentValue}
                                        onChangeText={(text) => setPaymentValue(text)}
                                    />
                                )}
                            </View>
                        </View>
                    )}
                />

            </View>
        </View>

    )
}
export default DueToday