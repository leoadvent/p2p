import { NavigationProp } from "@/src/navigation/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import ButtonComponent from "../components/button";
import InputText from "../components/input";
import FinanciamentoPagamentoView from "../components/viewFinanciamentoPagamento";
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase";
import { CUSTOMER } from "../types/customer";
import { FINANCIAMENTO_PAGAMENTO } from "../types/financiamento";
import BaseScreens from "./BaseScreens";



const FinanciamentoNegociar = () => {

    const route = useRoute();
    const {idFinanciamento, idParcela, cliente }: any = route.params ?? {}
    const financiamentoDataBase = useFinanciamentoDataBase();
    const navigation = useNavigation<NavigationProp>();

    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO>({} as FINANCIAMENTO_PAGAMENTO) 
    const [valorNegociado, setValorNegociado] = useState<string>("");
    const [atualizarDados, setAtualizarDados] = useState<any>()

    const width = Dimensions.get("screen").width

    async function buscarParcela(){
        const parcelas = await financiamentoDataBase.buscarParcelaPorId(idParcela);
        //setValorAserPago(parcelas!.valorAtual.toString().replaceAll(".",","))
        setFinanciamentoPagamento({
            id: parcelas?.id ?? '',
            dataVencimento: parcelas?.dataVencimento ?? new Date(),
            dataPagamento: parcelas?.dataPagamento ?? null,
            numeroParcela: parcelas!.numeroParcela,
            valorPago: parcelas!.valorPago,
            valorAtual: parcelas!.valorAtual,
            valorParcela: parcelas!.valorParcela,
            valorDiaria: parcelas!.valorDiaria,
            juros: parcelas!.juros,
            jurosAtraso: parcelas!.jurosAtraso,
            executadoEmpenho: parcelas!.executadoEmpenho,
            renegociado: parcelas!.renegociado,
            cliente: {} as CUSTOMER
        })
    }

    function handlerNegociarValor(){
        const valor = valorNegociado.replaceAll('.','').replace(',','.')

        financiamentoDataBase.negociarValorPagamento({idParcela: financiamentoPagamento.id, valorAtualNegociado: Number.parseFloat(valor)}).then((response) => {
            setAtualizarDados(response)
        })
    }

    useEffect(() => { buscarParcela() }, [atualizarDados])

    return(
        <BaseScreens title={`NEGOCIAR PARCELA ${financiamentoPagamento.numeroParcela} - CONTRATO ${idFinanciamento.substring(0, idFinanciamento.indexOf('-'))}`} rolbackStack>
            {Object.entries(financiamentoPagamento).length > 0 && 
               
               <>
                <FinanciamentoPagamentoView
                     pagamento={financiamentoPagamento} 
                     idFinanciamento={idFinanciamento} 
                     cliente={cliente}
                     isNegociar={false}
                     isReceber={false}
                     isMostraCliente={true}
                /> 
                <View style={{ display: financiamentoPagamento.dataPagamento === null ? 'flex' : 'none', gap: 10 }}>
                    <InputText 
                        label={"Ajustar Valor Atual"} 
                        placeholder="Digite o valor atual reajustado"
                        editable={true} 
                        onChangeText={setValorNegociado}
                        value={valorNegociado}
                        money keyboardType="numeric" />
                                
                    <ButtonComponent nameButton={"AJUSTAR VALOR ATUAL"} onPress={() => { handlerNegociarValor() }} typeButton={"primary"} width={width - 20} />   

                    {atualizarDados !== undefined  &&
                        <ButtonComponent nameButton={"REALIZAR PAGAMENTO"} onPress={() => { navigation.navigate('FinanciamentoReceber', {cliente: cliente, idFinanciamento: idFinanciamento, idParcela:financiamentoPagamento.id }) }} typeButton={"primary"} width={width - 20} /> 
                    }
                </View>

                </> 
                
            }           
        </BaseScreens>
    )
}
export default FinanciamentoNegociar