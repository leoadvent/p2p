import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import FinanciamentoPagamentoView from "../components/viewFinanciamentoPagamento";
import { useFinanciamentoDataBase } from '../database/useFinanciamentoDataBase';
import { FINANCIAMENTO_PAGAMENTO } from "../types/financiamento";
import BaseScreens from "./BaseScreens";


const FinanciamentoPagamento = () => {

    const route = useRoute();
    const { cliente, idFinanciamento  }: any = route.params ?? {}

    const financiamentoDataBase = useFinanciamentoDataBase(); 

    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    

    async function handlerBuscarFinanciamentoPorId(){
        const parcelas = await financiamentoDataBase.buscarParcelasDeFinanciamentoPorId(idFinanciamento);
        const parcelasComCliente = parcelas.map((parcela: any) => ({
            ...parcela,
            cliente: cliente
        }));
        setFinanciamentoPagamento(parcelasComCliente);
    }

    useFocusEffect(
        React.useCallback(() => {
           
            handlerBuscarFinanciamentoPorId()
      
        },[idFinanciamento])
    )

    return(
        <BaseScreens title={`${cliente.firstName    } - Contrato ${idFinanciamento.substring(0, idFinanciamento.indexOf('-'))}`} rolbackStack>
            <View style={{ gap: 20, display: 'flex', flexDirection:'column', height:'100%', justifyContent:"center",  }}>

                <FlatList 
                    data={financiamentoPagamento} 
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => ( 
                        <FinanciamentoPagamentoView
                            pagamento={item} 
                            idFinanciamento={idFinanciamento} 
                            cliente={cliente}
                            isNegociar={true}
                            isReceber={true}
                            isMostraCliente={false}
                        />
                    )}            
                />
                
            </View>
        </BaseScreens>
    )
}
export default FinanciamentoPagamento