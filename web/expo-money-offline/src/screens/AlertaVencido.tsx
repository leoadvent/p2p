import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import TextComponent from "../components/text/text";
import FinanciamentoPagamentoView from "../components/viewFinanciamentoPagamento";
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase";
import { FINANCIAMENTO_PAGAMENTO } from "../types/financiamento";
import BaseScreens from "./BaseScreens";

const AlertaVencido = () => {

    const useFinanciamento = useFinanciamentoDataBase();
        
        const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    
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
        <BaseScreens title={""} isDrawer>
            <TextComponent text={"Alerta Vencidos"} color={"rgb(247, 238, 238)"} fontSize={5} textAlign={"center"} />
        
            <ScrollView style={{ height: 400, marginTop:10 }}>                
                {handlerMontarparcelas()}
            </ScrollView>
        </BaseScreens>
    )
}
export default AlertaVencido