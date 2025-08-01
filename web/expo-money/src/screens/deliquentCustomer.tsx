import { Dimensions, FlatList, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { flatListBorderColor, textColorError, textColorPrimary, textColorWarning } from "../constants/colorsPalette "
import { useEffect, useState } from "react"
import { DelinquentCustomer } from "../types/delinquentCustomer"
import api from "../integration/axiosconfig"
import { Ionicons } from "@expo/vector-icons"
import ButtonComponent from "../components/button"
import { FinancialLoansPaid } from "../types/financialLoans"
import InputText from "../components/inputText"
import { stylesGlobal } from "../constants/styles"
import Contact from "../components/contact"
import { useFocusEffect } from "@react-navigation/native"
import React from "react"
import ShowImageCustomer from "../components/showImageCustomer"

const DelinquentCustomerScreen = () => {

    const [deliquentCustomers, setDeliquentCustomers] = useState<DelinquentCustomer[]>([])

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItemIdNegotiation, setEditingItemIdNegotiation] = useState<string | null>(null);
    const [paymentValue, setPaymentValue] = useState("");
    const [paymentValueNegotiation, setPaymentValueNegotiation] = useState("");
    const [refresh, setRefresh] = useState<any>()

    const handlePayPressNegotiation = async (item: FinancialLoansPaid) => {
        const amountPaid = parseFloat(paymentValueNegotiation.replace(/\D/g, "")) / 100;
      
        item.renegotiation = true;
        const paid = { ...item, amountPaid };
      
        try {
            const paiding = await api.post('/financial/loansPaid/renegotiation', paid);
          
            setRefresh(paiding)
      
            alert("Pagamento registrado com sucesso!");
        } catch (error) {
            console.error(error)
            alert("Erro ao registrar pagamento");
        } finally {
            setEditingItemId(null);
            setPaymentValueNegotiation("");
        }
      };


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

    useFocusEffect(
        React.useCallback(() => {
            api.get("/financial/deliquentCustomer").then((response) => {
                setDeliquentCustomers(response.data)
            }).catch((error) => {
                alert(error)
            })
        }, [refresh])
    )

    const width = Dimensions.get("window").width;
     
    return(
        <BaseScreens title=" ">
            <View style={ stylesGlobal.viewComponentBaseScree}>
                <TextComponent text={" PARCELAS EM ATRASO POR CLIENTE"} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                {Object.entries(deliquentCustomers).length > 0 && 
                    <FlatList 
                        data={deliquentCustomers}
                        keyExtractor={(item) => item.idClient}
                        renderItem={({ item }) => (
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
                            }}>
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    <ShowImageCustomer 
                                        urlPhoto={item.urlPhoto} 
                                        width={60} 
                                        height={60} 
                                        amountFinancialLoansPending={1} 
                                        firsName={item.firstName} 
                                        lastName={item.lastName}
                                    />
                                    <TextComponent text={`${item.firstName} ${item.lastName}`} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: 10 }}>
                                        <Contact
                                            phoneNumber={`${item.contact}`}
                                            message={`👋 Olá ${item.firstName}, tudo bem?

                                            💡 Estou entrando em contato para lembrar sobre a *parcela ${item.loansPaid.portion}* referente ao *contrato ${item.loansPaid.id.slice(0, item.loansPaid.id.indexOf('-'))}*, com vencimento em *${item.loansPaid.dueDate}*, que está em atraso há *${item.daysOverdue} dias*.

                                            💰 O valor atualizado está em *${item.loansPaid.currencyValueFormat}*.

                                            Se tiver qualquer dúvida, estou à disposição! 😊`}
                                        />
                                    </View>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: 10 }}>
                                        <Ionicons name="ribbon-outline" size={15} color={textColorError} />
                                        <TextComponent text={`Contrato: ${item.loansPaid.id.slice(0, item.loansPaid.id.indexOf('-'))}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: 10 }}>
                                        <Ionicons name="pricetag-outline" size={15} color={textColorWarning}/>
                                        <TextComponent text={`${item.loansPaid.interestDelay}%`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: 10 }}>
                                        <Ionicons name="calendar-clear-outline" size={15} color={textColorError}/>
                                        <TextComponent text={`${item.loansPaid.additionForDaysOfDelayFormat}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    </View>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: 10 }}>
                                        <Ionicons name="calendar-number-outline" size={15} color={textColorError}/>
                                        <TextComponent text={`${item.loansPaid.dueDate}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    </View>
                                    <TextComponent text={`Atraso de ${item.daysOverdue} dias`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                        <Ionicons name="flag-outline" size={15} color={textColorError}/>
                                        <TextComponent text={`: ${item.modalityFinancingDescription}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    </View>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: 10 }}>
                                        <Ionicons name="wallet-outline" size={15} color={textColorError}/>
                                        <TextComponent text={`Valor Solicitado: ${item.valueFinancialFormat}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    </View>
                                    <TextComponent text={`Valor Pago: ${item.valueAmountPaidFormat}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    <TextComponent text={`Valor: ${item.loansPaid.installmentValueFormat}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    <TextComponent text={`Valor Atual: ${item.loansPaid.currencyValueFormat}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                    <TextComponent text={`Valor Pago: ${item.loansPaid.amountPaidFormat}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    <TextComponent text={`Saldo Devedor: ${item.loansPaid.debitBalance}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />                                    
                                </View>                            
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>

                                    <ButtonComponent 
                                        nameButton={editingItemId === item.loansPaid.id ? "CONFIRMAR" : "PAGAR"} 
                                        onPress={() => editingItemId === item.loansPaid.id ? handlePayPress(item.loansPaid) : setEditingItemId(item.loansPaid.id)} 
                                        typeButton={"primary"} 
                                        width={"40%"} 
                                    />

                                    {editingItemId === item.loansPaid.id && (
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
                                <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", gap: 10 }}>
                                    <ButtonComponent 
                                        nameButton={editingItemIdNegotiation === item.loansPaid.id ? "CONFIRMAR" : "NEGOCIAR"}
                                        onPress={() => {editingItemIdNegotiation === item.loansPaid.id ? handlePayPressNegotiation(item.loansPaid) : setEditingItemIdNegotiation(item.loansPaid.id)}}
                                        typeButton={"warning"} 
                                        width={"40%"} 
                                    />
                                    {editingItemIdNegotiation === item.loansPaid.id && (
                                        <InputText 
                                            editable
                                            label="" 
                                            placeholder="Valor"
                                            money={true}
                                            keyboardType="numeric"
                                            width={150}
                                            value={paymentValueNegotiation}
                                            onChangeText={(text) => setPaymentValueNegotiation(text)}
                                        />
                                    )}
                                </View>
                            </View>
                        )}
                    />
                }
            </View>
        </BaseScreens>
    )
}
export default DelinquentCustomerScreen