import { NavigationProp } from "@/src/navigation/navigation";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import ButtonComponent from "../components/button";
import FinanciamentoPagamentoView from "../components/viewFinanciamentoPagamento";
import { useFinanciamentoDataBase } from '../database/useFinanciamentoDataBase';
import { FINANCIAMENTO_PAGAMENTO } from "../types/financiamento";
import BaseScreens from "./BaseScreens";

const FinanciamentoPagamento = () => {

    const route = useRoute();
    const { cliente, idFinanciamento  }: any = route.params ?? {}
    const navigation = useNavigation<NavigationProp>();

    const financiamentoDataBase = useFinanciamentoDataBase(); 

    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    
    const width = Dimensions.get("screen").width
    const height = Dimensions.get("screen").height

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
        <BaseScreens title={`${cliente.firstName    } - Contrato ${idFinanciamento.substring(0, idFinanciamento.indexOf('-'))}`} >
            
            <View style={{ gap: 20, display: 'flex', flexDirection:'column', height: height - 190, justifyContent:"center",  }}>

                <FlatList 
                    data={financiamentoPagamento} 
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    renderItem={({item}) => ( 
                        <FinanciamentoPagamentoView
                            pagamento={item} 
                            idFinanciamento={idFinanciamento} 
                            cliente={cliente}
                            isNegociar={true}
                            isReceber={true}
                            isMostraCliente={false}
                            isNotificacaoVencimento={false}
                        />
                    )}            
                />
                
            </View>

            <View style={{ marginTop:20}}>
                <ButtonComponent nameButton={"VOLTAR"} onPress={ () => {navigation.navigate('tabNavigator', { screen: 'Clients'})} } typeButton={"primary"} width={width} />
            </View>
            
        </BaseScreens>
    )
}
export default FinanciamentoPagamento