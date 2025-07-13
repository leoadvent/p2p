import { backgroundPrimary, backgroundSecondary } from "@/src/constants/colorsPalette ";
import { useFinanciamentoDataBase } from "@/src/database/useFinanciamentoDataBase";
import { FINANCIAMENTO_PAGAMENTO } from "@/src/types/financiamento";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import ButtonComponent from "../button";
import InputText from "../input";
import FinanciamentoPagamentoView from "../viewFinanciamentoPagamento";


const AlertaVencimento = () => {

    const width = Dimensions.get("screen").width

    const useFinanciamento = useFinanciamentoDataBase();
    
    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    const [quantDiasVencimento, setQuantDiasVencimento] = useState(10)
    const [quantDiasVencimentoString, setQuantDiasVencimentoString] = useState<string>("10")
    const [mostar, setMostrar] = useState<boolean>(false)

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
        <View style={{ alignItems:"center", width:"100%", borderWidth:mostar ? 1 : 0, borderColor:"white", borderRadius:10, backgroundColor: mostar ? backgroundSecondary : backgroundPrimary}}>
            
            <View style={{display:'flex', flexDirection:"row", marginTop:5, alignItems:"center", justifyContent:"center", gap:10, width:"100%"}}>
                <View style={{ display: mostar ? 'flex':'none',  marginTop:10, width: 120, marginLeft:8 }}> 
                    <InputText 
                        label={"DIAS PARA VENCER"} 
                        value={quantDiasVencimentoString}
                        onChangeText={setQuantDiasVencimentoString}
                        keyboardType="numeric"
                        editable={true} 
                    />
                </View>
                <View style={{ marginTop:10, flex: 1 }}>
                    <ButtonComponent 
                        nameButton={mostar ? "OCULTAR VENCIMENTO" : "BUSCAR VENCIMENTOS"} 
                        onPress={() => setMostrar(!mostar)} typeButton={"primary"} width={mostar ? 200 : width-50} height={65} />
                </View>
            </View>

            

            <ScrollView style={{ display: mostar ? 'flex':'none', height: 450, marginTop:10 }}>                
                {handlerMontarparcelas()}
            </ScrollView>
        </View>
    )
}

export default AlertaVencimento