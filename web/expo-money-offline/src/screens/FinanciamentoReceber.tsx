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


const FinanciamentoReceber = () => {

    const route = useRoute();
    const {idFinanciamento, idParcela, cliente }: any = route.params ?? {}
    const navigation = useNavigation<NavigationProp>();

    const financiamentoDataBase = useFinanciamentoDataBase();

    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO>({} as FINANCIAMENTO_PAGAMENTO) 
    const [valorAserPago, setValorAserPago] = useState<string>("");
    const [atualizarStatus, setAtualizarStatus] = useState<any>();

    async function buscarParcela(){
        const parcelas = await financiamentoDataBase.buscarParcelaPorId(idParcela);
        setValorAserPago(parcelas!.valorAtual.toString().replaceAll(".",","))
        setFinanciamentoPagamento({
            id: parcelas?.id ?? '',
            dataVencimento: parcelas?.dataVencimento ?? new Date(),
            dataPagamento: parcelas?.dataPagamento ?? null,
            dataUltimoPagamento: parcelas?.dataUltimoPagamento ?? new Date(),
            numeroParcela: parcelas!.numeroParcela,
            valorPago: parcelas!.valorPago,
            valorAtual: parcelas!.valorAtual,
            valorParcela: parcelas!.valorParcela,
            valorDiaria: parcelas!.valorDiaria,
            juros: parcelas!.juros,
            jurosAtraso: parcelas!.jurosAtraso,
            modalidade: parcelas!.modalidade,
            executadoEmpenho: parcelas!.executadoEmpenho,
            pagamentoRealizado: parcelas!.pagamentoRealizado,
            renegociado: parcelas!.renegociado,
            cliente: {} as CUSTOMER
        })
    }

    const width = Dimensions.get("screen").width

    useEffect(() => { buscarParcela() }, [atualizarStatus])

    function handlerPagarParcela(){
        
        let valorPago = valorAserPago.replaceAll('.','').replace(",",'.')

        let pagamento: FINANCIAMENTO_PAGAMENTO = {
            ...financiamentoPagamento, 
            valorPago: parseFloat(valorPago),
            dataPagamento: parseFloat(valorPago) >= financiamentoPagamento.valorAtual ? new Date() : null
        }

        financiamentoDataBase.updateParcela({idParcela: idParcela, idFinanciamento: idFinanciamento, parcela: pagamento}).then((response) => {
            setAtualizarStatus(response)
        }).catch((error) => {
            alert(error)
        })

    }

    return(
        <BaseScreens title={"RECEBER"}>
   
            {Object.entries(financiamentoPagamento).length > 0 &&
                <FinanciamentoPagamentoView 
                    pagamento={financiamentoPagamento} 
                    idFinanciamento={""}
                    cliente={cliente} 
                    isNegociar={true} 
                    isReceber={false}
                    isMostraCliente={true} 
                />
            }

            <View style={{ display: financiamentoPagamento.dataPagamento === null ? 'flex' : 'none', gap: 10, marginBottom: 50 }}>
                <InputText 
                    label={"Valor Pago"} 
                    editable={true} 
                    onChangeText={setValorAserPago}
                    value={valorAserPago}
                    money keyboardType="numeric" />
                                
                <ButtonComponent nameButton={"RECEBER"} onPress={() => {handlerPagarParcela()}} typeButton={"primary"} width={width - 20} />
                        
            </View>

            <ButtonComponent nameButton={"VOLTAR"} onPress={() => {navigation.navigate('FinanciamentoPagamento', {cliente: cliente, idFinanciamento})}} typeButton={"warning"} width={width - 20} />
                
        </BaseScreens>
    )
}
export default FinanciamentoReceber