import { Dimensions, FlatList, KeyboardAvoidingView, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { backgroundOpacity, backgroundPrimary, backgroundSolid, borderCollor, flatListBackgroundColorpending, flatListBorderColor, textColorError, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import { useRoute } from "@react-navigation/native"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { FinancialLoansPaid } from "../types/financialLoans"
import InputText from "../components/inputText"
import { Ionicons } from "@expo/vector-icons"
import ButtonComponent from "../components/button"
import api from "../integration/axiosconfig"
import { stylesGlobal } from "../constants/styles"
import ModalSystem from "../components/modal"
import BalloonPayment from "../components/ballonPayment"

const FinancialLoansPaidPendingByCustumer = () => {

    const width = Dimensions.get("screen").width
    const height = Dimensions.get("screen").height

    const route = useRoute();
    const { financialLoasPaid, loansId, commitmentItems } : any = route.params;

    const [financialLoansPaid, setFinancialLoansPaid] = useState<FinancialLoansPaid[]>([])
    const [financialLonasPaidSelected, setFinancialLonasPaidSelected] = useState<FinancialLoansPaid>({} as FinancialLoansPaid)

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [paymentValue, setPaymentValue] = useState("");

    const [modalVisibleAdd, setModalVisibleAdd] = useState(false);

    const [modalExecutedPledge, setModalExecutedPledge] = useState<boolean>(false);

    const handlePayPress = async (item: FinancialLoansPaid) => {
        const amountPaid = parseFloat(paymentValue.replace(/\D/g, "")) / 100;
      
        const paid = { ...item, amountPaid };
      
        try {
          const amaoutPaid = await api.post('/financial/loansPaid', paid);
          
          // Atualiza localmente o array
          setFinancialLoansPaid(prev =>
            prev.map((loan) =>
              loan.id === paid.id ? { ...loan, 
                amountPaid: paid.amountPaid, 
                dueDate: amaoutPaid.data.dueDate, 
                duePayment: amaoutPaid.data.duePayment, 
                amountPaidFormat: amaoutPaid.data.amountPaidFormat  } : loan
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
                marginBottom: 25,
                borderBottomColor: flatListBorderColor,
                borderRadius: 5,
                padding: 10,
                gap: 10,
                backgroundColor: item.lateInstallment || item.daysOverdue > 0 ? flatListBackgroundColorpending : 'transparent',
                }}
            >
               
                <View style={{ display:item.amountPaid === item.currencyValue && item.amountPaid > 0 ? "none": "flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between"}}>
                    <View style={{display:"flex", flexDirection:"row", gap:10, alignItems:"center"}}>
                        <TextComponent text={`%`} color={textColorWarning} fontSize={30} textAlign={"auto"}/> 
                        <TextComponent text={`${item.rate}`} color={textColorPrimary} fontSize={20} textAlign={"auto"}/> 
                    </View>
                    <View style={{display:"flex", flexDirection:"row", gap:10, alignItems:"center"}}>
                        <Ionicons name="calendar-number" size={20} color={textColorWarning}/>
                        <TextComponent text={`${item.additionForDaysOfDelayFormat}`} color={textColorPrimary} fontSize={24} textAlign={"auto"}/> 
                    </View>
                </View>
                <View style={{ display:item.amountPaid === item.currencyValue && item.amountPaid > 0 ? "none": "flex", flexDirection:"row", flexWrap:"wrap", gap:10, width:"100%", justifyContent:"center"}}>
                    <TextComponent text={`Vencimento: ${item.dueDate}`} color={textColorPrimary} fontSize={20} textAlign={"center"} />
                </View>
                <View style={{ display:item.amountPaid === item.currencyValue && item.amountPaid > 0 ? "none": "flex", flexDirection:"row", flexWrap:"wrap", gap:10, width:"100%", justifyContent:"space-between"}}>
                   
                   <BalloonPayment>
                            <TextComponent text={`Valor`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                            <TextComponent text={`${item.installmentValueFormat}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                    </BalloonPayment>
                    
                    {item.currencyValue > 0 && 
                        <BalloonPayment>
                            <TextComponent text={`Valor Atual`} color={textColorPrimary} fontSize={12} textAlign={"auto"} /> 
                            <TextComponent text={`${item.currencyValueFormat}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} /> 
                        </BalloonPayment>
                    }
                     {item.dayLastPaymentOnerous > 0 && 
                        <BalloonPayment>
                            <TextComponent text={`Dias Corridos`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                            <TextComponent text={`${item.dayLastPaymentOnerous}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                        </BalloonPayment>
                    }
                    {item.currencyValue === 0 &&
                        <BalloonPayment>
                           <TextComponent text={`Pagamento em Dia`} color={textColorPrimary} fontSize={12} textAlign={"auto"} /> 
                        </BalloonPayment>
                     }
                </View>
                <View style={{ display:item.amountPaid === item.currencyValue && item.amountPaid > 0 ? "none": "flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between"}}>
                    {item.currencyValue > 0 && 
                        <BalloonPayment>
                            <TextComponent text={`Devedor`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                            <TextComponent text={`${item.debitBalance}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                        </BalloonPayment>
                    }
                    {item.currencyValue > 0 && 
                        <BalloonPayment>
                            <TextComponent text={`Valor Pago`} color={textColorPrimary} fontSize={12} textAlign={"auto"} /> 
                            <TextComponent text={`${item.amountPaidFormat}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} /> 
                        </BalloonPayment>
                    }
                    {item.valueDiary > 0 && 
                        <BalloonPayment>
                            <TextComponent text={`Arrecadado`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                            <TextComponent text={`${item.amountPaidOnerousFormat}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                        </BalloonPayment>    
                    }
                    {item.amortizedValue > 0 && 
                        <BalloonPayment>    
                            <TextComponent text={`Amortizado`} color={textColorPrimary} fontSize={7} textAlign={"auto"} /> 
                            <TextComponent text={`${item.amortizedValueFormat}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} /> 
                        </BalloonPayment>
                    }
                </View>

                <View style={{ display:item.amountPaid === item.currencyValue && item.amountPaid > 0 ? "none": "flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-between", alignItems:"flex-end"}}>
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
                <View style={{ display:item.amountPaid === item.currencyValue && item.amountPaid > 0 ? "flex": "none", flexDirection:"row", padding:20, gap:10, width:"100%", justifyContent:"space-between", alignItems:"center"}}>
                    <Ionicons name="checkmark-done-outline" size={25} color={textColorSuccess}/>
                    <View style={{ display:"flex", flexDirection:"column", gap:10, width:"90%", justifyContent:"space-between", alignItems:"flex-start", marginLeft:20}}>
                        <TextComponent text={`Parcela ${item.portion}`} color={"rgb(255, 255, 255)"} fontSize={14} textAlign={"center"} />
                        <TextComponent text={`Pago em ${item.duePayment}`} color={"rgb(255, 255, 255)"} fontSize={14} textAlign={"center"} />
                        {item.daysOverdue > 0 && <TextComponent text={`Vencimento ${item.dueDate}`} color={"rgb(255, 255, 255)"} fontSize={14} textAlign={"center"} /> }
                        <TextComponent text={`Valor pago: ${item.amountPaidFormat}`} color={"rgb(255, 255, 255)"} fontSize={14} textAlign={"center"} />
                    </View>
                </View>
            </View>
        )

    }

    function handleExecutedPledge(){
        alert("Executar a Garantia" + loansId)  
        api.patch(`/financial/executedPledge/${loansId}`).then((response) => {
            alert("Garantia executada com sucesso: " + JSON.stringify(response.data))
            setFinancialLoansPaid(response.data)
        }).catch((error) => {   
            alert("Erro ao executar a garantia: " + JSON.stringify(error.mensagem))   
            console.error("Erro ao executar a garantia: " + JSON.stringify(error))
        }).finally(() => {
            setModalExecutedPledge(false)   
        })
    }

    function handleAddSingleInstallments(){
       alert("Adicionar parcela" + JSON.stringify(financialLoasPaid[0].id))
       api.patch(`/financial/addSingleInstallments/${financialLoasPaid[0].id}`)
       .then((response) => {
            alert("Parcela adicionada com sucesso: " + JSON.stringify(response.data))
            setFinancialLoansPaid(response.data)
       }).catch((error) => {
              alert("Erro ao adicionar parcela: " + JSON.stringify(error))   
              console.error("Erro ao adicionar parcela: " + JSON.stringify(error))
        }).finally(() => {
            setModalVisibleAdd(false)   
        })
       // patch /financial/addSingleInstallments/{idLoansPaid}
    }
      
        
    useEffect(() => {
        if (financialLoasPaid?.length) {
          setFinancialLoansPaid(financialLoasPaid);
        }
    }, []);
    
    return(
        <BaseScreens title={"PARCELA EMPRÉSTIMO"} rolbackStack>
            <View style={ [stylesGlobal.viewComponentBaseScree, {width: width}]}>

                {Object.entries(financialLoansPaid).length > 0 && editingItemId === null &&
                    <>
                        <ModalSystem 
                            buttonClose={<TextComponent text={"Executar a Garantia"} color={textColorPrimary} fontSize={16} textAlign={"center"}/>}
                            title={"Executar a Garantia"} 
                            setVisible={setModalExecutedPledge} 
                            visible={modalExecutedPledge}
                            heightProp={650}
                            children={
                                <View style={{ display:"flex", flexDirection:"column", gap:50, width:"100%", justifyContent:"space-between", alignContent:"center", alignItems:"center"}}>
                                    <TextComponent text={`Tem certeza que quer executar a Garantia?`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>
                                    
                                    {commitmentItems.length > 0 && 
                                        <FlatList
                                            data={commitmentItems}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={({ item }) => (
                                                <View style={{ 
                                                        display:"flex", 
                                                        flexDirection:"row", 
                                                        gap:10, 
                                                        width:"100%", 
                                                        justifyContent:"space-between", 
                                                        alignItems:"center",
                                                        padding: 10,
                                                        borderWidth: 1, 
                                                        marginBottom: 8,
                                                        borderBottomColor: flatListBorderColor,
                                                        borderRadius: 5,
                                                    }}>
                                                    <Ionicons name="bag-outline" size={15} color={textColorWarning}/>
                                                    <TextComponent text={`${item.nameItem.slice(0, 20)} ${item.nameItem.length > 20 ? '...' : ''}`} color={textColorPrimary} fontSize={12} textAlign={"center"}/>
                                                    <TextComponent text={`${item.valueItemFormated}`} color={textColorPrimary} fontSize={12} textAlign={"center"}/>
                                                </View>
                                            )}
                                            />
                                    }
                                      
                                    <View style={{ display:"flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-evenly", alignItems:"center"}}>
                                        <ButtonComponent nameButton={"SIM"} onPress={() => {handleExecutedPledge()}} typeButton={"warning"} width={"40%"} />
                                        <ButtonComponent nameButton={"NÃO"} onPress={() => {setModalExecutedPledge(false)}} typeButton={"success"} width={"40%"} />     
                                    </View>
                                </View>
                            } 
                        />
                       

                        <FlatList 
                            keyboardShouldPersistTaps="always"
                            extraData={editingItemId}
                            data={[...financialLoansPaid].sort((a, b) => Number(a.portion) - Number(b.portion))}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (item.id !== editingItemId ? renderView(item) : <View></View>)}
                        />
                        {/*
                        <ModalSystem 
                            buttonClose={
                                <View style={{ display:"flex", flexDirection:"row", gap:10, width:"90%", justifyContent:"space-between", alignItems:"center"}}>
                                    <ButtonComponent nameButton={"ADD PARCELA"} onPress={() => {setModalVisibleAdd(!modalVisibleAdd)}} typeButton={"warning"} width={"100%"} />
                                </View>
                            }
                            heightProp={height - 400}
                            title={"Adicionar Parcela"} 
                            setVisible={setModalVisibleAdd} 
                            visible={modalVisibleAdd} 
                            children={
                                <View style={{ display:"flex", flexDirection:"column", gap:50, width:"100%", justifyContent:"space-between", alignItems:"center"}}>
                                    <TextComponent text={"Tem certeza que quer adicionar mais uma parcela?"} color={textColorPrimary} fontSize={20} textAlign={"center"}/>
                                    <View style={{ display:"flex", flexDirection:"row", gap:10, width:"100%", justifyContent:"space-evenly", alignItems:"center"}}>
                                        <ButtonComponent nameButton={"SIM"} onPress={() => {handleAddSingleInstallments()}} typeButton={"warning"} width={"40%"} />
                                        <ButtonComponent nameButton={"NÃO"} onPress={() => {setModalVisibleAdd(false)}} typeButton={"success"} width={"40%"} />
                                    </View>
                                    
                                </View>
                            }/>
                            */}
                    </>
                }
                {editingItemId !== null &&
                    <View style={{ display: "flex", flex: 1, position:"absolute", margin: 10, marginTop: 20, flexDirection:"column", gap:10, alignItems:"center", alignContent:"center", justifyContent:"center", backgroundColor:backgroundPrimary, borderRadius:10, zIndex:2 }}>
                       
                        {renderView(financialLonasPaidSelected)}

                        <View style={{ display: "flex",  margin: 10, flexDirection:"row", gap:10, alignItems:"flex-end", alignContent:"center", justifyContent:"center" }}>
                            
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