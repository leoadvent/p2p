import { useFinanciamentoDataBase } from "@/src/database/useFinanciamentoDataBase";
import BaseScreens from "@/src/screens/BaseScreens";
import { FINANCIAMENTO_PAGAMENTO } from "@/src/types/financiamento";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import InputText from "../components/input";
import TextComponent from "../components/text/text";
import FinanciamentoPagamentoView from "../components/viewFinanciamentoPagamento";
import { textColorPrimary } from "../constants/colorsPalette ";


const AlertaVencimento = () => {

    const dimension = Dimensions.get("screen")

    const useFinanciamento = useFinanciamentoDataBase();
    
    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    const [quantDiasVencimento, setQuantDiasVencimento] = useState(10)
    const [quantDiasVencimentoString, setQuantDiasVencimentoString] = useState<string>("10")

    async function handlerBuscarParagmentoVencendo(){
        setFinanciamentoPagamento(await useFinanciamento.buscarParcelaVencimentoEmDias(quantDiasVencimento));
    }
    
    useFocusEffect(
        React.useCallback(() => {
            handlerBuscarParagmentoVencendo();
        }, [quantDiasVencimento]) 
    );

    useEffect(() => {
        if(Number.parseInt(quantDiasVencimentoString) <= 0 || quantDiasVencimentoString === ""){
            return
        }
        setQuantDiasVencimento(Number.parseInt(quantDiasVencimentoString))
    },[quantDiasVencimentoString])

    function handlerMontarparcelas(){
        return Object.entries(financiamentoPagamento).length > 0 && financiamentoPagamento.map((item) => (
            <FinanciamentoPagamentoView 
                pagamento={item} idFinanciamento={""} cliente={item.cliente} isNegociar={false} isReceber={true} isMostraCliente={true} isNotificacaoVencimento={true} />
        ))
    }
    return(
        <BaseScreens title={""} isDrawer={true}>
            
            <View style={{ flexDirection:"row", width:dimension.width -50, marginTop:5 ,gap:10, margin: 10, alignItems:"center" }}>
                <View> 
                    <InputText 
                        label={"DIAS PARA VENCER"} 
                        value={quantDiasVencimentoString}
                        onChangeText={setQuantDiasVencimentoString}
                        keyboardType="numeric"
                        editable={true} 
                    />
                    
                </View>
                <View style={{width:dimension.width / 2}}>
                    <TextComponent 
                        text={`Total de financiamentos encontrados: ${financiamentoPagamento.length}`} 
                        color={textColorPrimary} numberOfLines={2}
                        fontSize={14} textAlign={"center"} />
                </View>
            </View>

            {handlerMontarparcelas()}

        
        </BaseScreens>
    )
}

export default AlertaVencimento