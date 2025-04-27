import { Dimensions, FlatList, KeyboardAvoidingView, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { backgroundOpacity, flatListBorderColor, textColorError, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import { useRoute } from "@react-navigation/native"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { FinancialLoansPaid } from "../types/financialLoans"
import InputText from "../components/inputText"
import { Ionicons } from "@expo/vector-icons"
import ButtonComponent from "../components/button"
import api from "../integration/axiosconfig"
import { stylesGlobal } from "../constants/styles"

const FinancialLoansPaidPendingByCustumer = () => {

    const width = Dimensions.get("window").width;

    const route = useRoute();
    const { financialLoasPaid } : any = route.params;

    const [financialLoansPaid, setFinancialLoansPaid] = useState<FinancialLoansPaid[]>([])
    const [financialLonasPaidSelected, setFinancialLonasPaidSelected] = useState<FinancialLoansPaid>({} as FinancialLoansPaid)

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [paymentValue, setPaymentValue] = useState("");

    const handlePayPress = async (item: FinancialLoansPaid) => {
        const amountPaid = parseFloat(paymentValue.replace(/\D/g, "")) / 100;
      
        const paid = { ...item, amountPaid };
      
        try {
          await api.post('/financial/loansPaid', paid);
          
          // Atualiza localmente o array
          setFinancialLoansPaid(prev =>
            prev.map((loan) =>
              loan.id === paid.id ? { ...loan, amountPaid: paid.amountPaid } : loan
            )
          );
      
            alert("Pagamento registrado com sucesso!");
        } catch (error) {
            console.error(error)
            alert("Erro ao registrar pagamento");
        } finally {
            setEditingItemId(null);
            setPaymentValue("");
        }
      };
      
    
    function renderView(item : FinancialLoansPaid){

        return(
            <View style={{ 
                display: "flex",
                flexDirection: "column",
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
               
                <View style={{ display:"flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between"}}>
                    <Ionicons name="pricetag-outline" size={15} color={textColorWarning}/>
                    <TextComponent text={`${item.rate}%`} color={textColorPrimary} fontSize={10} textAlign={"auto"}/> 
                    <Ionicons name="pricetag-outline" size={15} color={textColorError}/>
                    <TextComponent text={`${item.interestDelay}%`} color={textColorPrimary} fontSize={10} textAlign={"auto"}/> 
                    <Ionicons name="calendar-clear-outline" size={15} color={textColorError}/>
                    <TextComponent text={`${item.additionForDaysOfDelayFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"}/> 
                    <Ionicons name="calendar-number-outline" size={15} color={item.lateInstallment ? textColorError : textColorSuccess}/>
                    <TextComponent text={`${item.dueDate}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                </View>
                <View style={{ display:"flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between"}}>
                    <TextComponent text={`Valor: ${item.installmentValueFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                    <TextComponent text={`Valor Atual: ${item.currencyValueFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                    <TextComponent text={`Valor Pago: ${item.amountPaidFormat}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                </View>
                <View style={{ display:item.amountPaid === item.currencyValue ? "none": "flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between"}}>
                    <TextComponent text={`Saldo Devedor: ${item.debitBalance}`} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                </View>

                <View style={{ display:item.amountPaid === item.currencyValue ? "none": "flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between", alignItems:"flex-end"}}>
                    <ButtonComponent 
                        nameButton={editingItemId === item.id ? "CANCELAR" : "PAGAR"} 
                        onPress={() => {
                            if (editingItemId === item.id) {
                                setEditingItemId(null);
                                setFinancialLonasPaidSelected({} as FinancialLoansPaid)
                            } else {
                                setEditingItemId(item.id);
                                setFinancialLonasPaidSelected(item)
                            }
                          }} 
                        typeButton={editingItemId === item.id ? "warning" : "primary"} 
                        width={"100%"} 
                    />
                
                </View>
                <View style={{ display:item.amountPaid === item.currencyValue ? "flex": "none", flexDirection:"row", padding:20, gap:10, width:"100%", justifyContent:"space-between", alignItems:"center"}}>
                    <Ionicons name="checkmark-done-outline" size={25} color={textColorSuccess}/>
                    <TextComponent text={`Pago em ${item.duePayment} no valor de: ${item.amountPaidFormat}`} color={"rgb(255, 255, 255)"} fontSize={14} textAlign={"center"} />
                </View>
            </View>
        )

    }
      
        
    useEffect(() => {
        if (financialLoasPaid?.length) {
          setFinancialLoansPaid(financialLoasPaid);
        }
    }, []);
    
    return(
        <BaseScreens title={"PARCELA EMPRÉSTIMO"} rolbackStack>
            <View style={ stylesGlobal.viewComponentBaseScree}>

                {Object.entries(financialLoansPaid).length > 0 &&
                    <FlatList 
                        keyboardShouldPersistTaps="always"
                        extraData={editingItemId}
                        data={[...financialLoansPaid].sort((a, b) => Number(a.portion) - Number(b.portion))}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (item.id !== editingItemId ? renderView(item) : <View></View>)}
                    />
                }
                {editingItemId !== null &&
                    <View style={{ display: "flex", margin: 10, flexDirection:"column", gap:10, alignItems:"center", alignContent:"center", justifyContent:"center", backgroundColor:backgroundOpacity }}>
                       
                        {renderView(financialLonasPaidSelected)}

                        <View style={{ display: "flex", margin: 10, flexDirection:"row", gap:10, alignItems:"flex-end", alignContent:"center", justifyContent:"center" }}>
                            
                            <ButtonComponent 
                                nameButton={"PAGAR"} 
                                onPress={() => {handlePayPress(financialLonasPaidSelected);}} 
                                typeButton={"primary"} 
                                width={"40%"} 
                            />
                            
                            <InputText 
                                display="flex"
                                editable
                                label="Valor a ser pago *" 
                                placeholder="Valor"
                                money={true}
                                keyboardType="numeric"
                                width={150}
                                value={paymentValue}
                                onChangeText={(text) => setPaymentValue(text)}
                            />
                            </View>
                    </View>
                }
            </View>
        </BaseScreens>
    )
}
export default FinancialLoansPaidPendingByCustumer