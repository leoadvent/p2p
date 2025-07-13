import { backgroundPrimary, backgroundSecondary } from "@/src/constants/colorsPalette ";
import { useFinanciamentoDataBase } from "@/src/database/useFinanciamentoDataBase";
import { FINANCIAMENTO_PAGAMENTO } from "@/src/types/financiamento";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import ButtonComponent from "../button";
import FinanciamentoPagamentoView from "../viewFinanciamentoPagamento";


const AlertaVencidas = () => {

    const width = Dimensions.get("screen").width

    const useFinanciamento = useFinanciamentoDataBase();
    
    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    const [mostar, setMostrar] = useState<boolean>(false)

    async function handlerBuscarParagmentoVencendo(){
        setFinanciamentoPagamento(await useFinanciamento.buscarParcelaVencidas());
    }
    
    useFocusEffect(
        React.useCallback(() => {
            handlerBuscarParagmentoVencendo();
        }, []) 
    );

    function handlerMontarparcelas(){
        return Object.entries(financiamentoPagamento).length > 0 && financiamentoPagamento.map((item) => (
            <FinanciamentoPagamentoView 
                pagamento={item} idFinanciamento={""} cliente={item.cliente} isNegociar={false} isReceber={true} isMostraCliente={true} isNotificacaoVencimento={false} />
        ))
    }
    return(
        <View style={{ alignItems:"center", width:"100%", borderWidth:mostar ? 1 : 0, borderColor:"white", borderRadius:10, backgroundColor: mostar ? backgroundSecondary : backgroundPrimary}}>
            
            <View style={{ marginTop:10, }}>
                <ButtonComponent 
                    nameButton={mostar ? "OCULTAR VENCIDOS" : "BUSCAR VENCIDOS"} 
                    onPress={() => setMostrar(!mostar)} typeButton={"error"} width={width-50} height={65} />
            </View>
                       
            <ScrollView style={{ display: mostar ? 'flex':'none', height: 400, marginTop:10 }}>                
                {handlerMontarparcelas()}
            </ScrollView>
        </View>
    )
}

export default AlertaVencidas