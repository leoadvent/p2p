import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import BalaoTexto from "../components/balaoTexto";
import ButtonComponent from "../components/button";
import Contato from "../components/contato";
import InputText from "../components/input";
import TextComponent from "../components/text/text";
import { backgroundColorError, backgroundOpacityBallon, backgroundWarning, flatListBorderColor, iconColorPrimary, textColorPrimary } from "../constants/colorsPalette ";
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase";
import { CUSTOMER } from "../types/customer";
import { FINANCIAMENTO_PAGAMENTO } from "../types/financiamento";
import { DataUtils } from "../utils/dataUtil";
import { IconsUtil } from "../utils/iconsUtil";
import { StringUtil } from "../utils/stringUtil";
import BaseScreens from "./BaseScreens";

const FinanciamentoReceber = () => {

    const route = useRoute();
    const {idFinanciamento, idParcela, cliente }: any = route.params ?? {}

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
            numeroParcela: parcelas!.numeroParcela,
            valorPago: parcelas!.valorPago,
            valorAtual: parcelas!.valorAtual,
            valorParcela: parcelas!.valorParcela,
            valorDiaria: parcelas!.valorDiaria,
            juros: parcelas!.juros,
            jurosAtraso: parcelas!.jurosAtraso,
            executadoEmpenho: parcelas!.executadoEmpenho,
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
        <BaseScreens title={""} rolbackStack>
            {Object.entries(financiamentoPagamento).length > 0 && 
                <View style={{ gap: 20, display: 'flex', flexDirection:'column', height:'100%',  }}>
                    <View style={{ 
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 20,
                                width: width - 20, 
                                borderWidth: 1, 
                                marginBottom: 50,
                                borderBottomColor: flatListBorderColor,
                                borderRadius: 5,
                                padding: 10,
                                backgroundColor: DataUtils.calcularDiasEntreDatas(financiamentoPagamento.dataVencimento, new Date()) > 0 && financiamentoPagamento.dataPagamento === null ? backgroundColorError : backgroundWarning
                            }}>
                                <View style={{ display: DataUtils.calcularDiasEntreDatas(financiamentoPagamento.dataVencimento, new Date()) > 0 && financiamentoPagamento.dataPagamento === null ? "flex" : "none", flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
                                    <Contato 
                                        telefoneNumero={cliente.contact} 
                                        mensagem={StringUtil.formatarMensagemPagamentoAtrasado({
                                            financiamentoPagamento: financiamentoPagamento,
                                            idContrato: idFinanciamento.toString(),
                                            nomeCliente: cliente.firstName
                                        })}
                                    />
                                </View>

                                <View style={{ flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
                                    <View style={{ width:70}}>
                                        <BalaoTexto 
                                            backgroundColor={backgroundOpacityBallon} 
                                            borderWidth={0} 
                                            children={
                                                <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                    {IconsUtil.numeroParcela({size: 25, color: iconColorPrimary })}
                                                    <View style={{ flexDirection:"column" }}>
                                                        <TextComponent 
                                                            text={"Parcela"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                        <TextComponent 
                                                            text={financiamentoPagamento.numeroParcela.toString()} 
                                                            color={textColorPrimary} 
                                                            fontSize={16} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </View>
                                    <View style={{ width:130}}>
                                        <BalaoTexto 
                                            backgroundColor={backgroundOpacityBallon} 
                                            borderWidth={0} 
                                            children={
                                                <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                    {IconsUtil.calendarioNumero({size: 25, color: iconColorPrimary })}
                                                    <View style={{ flexDirection:"column" }}>
                                                        <TextComponent 
                                                            text={"Data de Vencimento"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                        <TextComponent 
                                                            text={DataUtils.formatarDataBR(financiamentoPagamento.dataVencimento)} 
                                                            color={textColorPrimary} 
                                                            fontSize={16} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </View>
                                    <View style={{ width:120}}>
                                        <BalaoTexto 
                                            backgroundColor={backgroundOpacityBallon} 
                                            borderWidth={0} 
                                            children={
                                                <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center", gap: 2 }}>
                                                    {IconsUtil.iconTaxa({size: 25, color: iconColorPrimary })}
                                                    <View style={{ flexDirection:"column" }}>
                                                        <TextComponent 
                                                            text={"Juros"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                        <TextComponent 
                                                            text={`${financiamentoPagamento.juros}%`} 
                                                            color={textColorPrimary} 
                                                            fontSize={14} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                    <View style={{ flexDirection:"column" }}>
                                                        <TextComponent 
                                                            text={"Juros Atraso"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                        <TextComponent 
                                                            text={`${financiamentoPagamento.jurosAtraso}%`} 
                                                            color={textColorPrimary} 
                                                            fontSize={14} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
                                    <View style={{ width:75,}}>
                                        <BalaoTexto 
                                            backgroundColor={backgroundOpacityBallon} 
                                            borderWidth={0} 
                                            children={
                                                <View style={{ flexDirection:"column", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                    <TextComponent 
                                                            text={"Dias em Atraso"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                    <View style={{ flexDirection:"row", alignItems:"center", alignContent:"center", paddingLeft:10, gap:5  }}>
                                                        
                                                        {IconsUtil.dia({size: 25, color: iconColorPrimary })}
                                                        <TextComponent 
                                                            text={DataUtils.calcularDiasEntreDatas(financiamentoPagamento.dataVencimento, new Date()).toString()} 
                                                            color={textColorPrimary} 
                                                            fontSize={16} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </View>  
                                    <View style={{ width:120}}>
                                        <BalaoTexto 
                                            backgroundColor={backgroundOpacityBallon} 
                                            borderWidth={0} 
                                            children={
                                                <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                    {IconsUtil.numeroParcela({size: 25, color: iconColorPrimary })}
                                                    <View style={{ flexDirection:"column" }}>
                                                        <TextComponent 
                                                            text={"Valor Parcela"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                        <TextComponent 
                                                            text={StringUtil.formatarMoedaReal(financiamentoPagamento.valorParcela.toString())} 
                                                            color={textColorPrimary} 
                                                            fontSize={16} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </View>
                                    <View style={{ width:130}}>
                                        <BalaoTexto 
                                            backgroundColor={backgroundOpacityBallon} 
                                            borderWidth={0} 
                                            children={
                                                <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                    {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                                    <View style={{ flexDirection:"column" }}>
                                                        <TextComponent 
                                                            text={"Valor Atual"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                        <TextComponent 
                                                            text={StringUtil.formatarMoedaReal(financiamentoPagamento.valorAtual.toString())} 
                                                            color={textColorPrimary} 
                                                            fontSize={16} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </View>
                                </View>
                                
                                <View style={{ flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
                                    
                                    <View style={{ width:150}}>
                                        <BalaoTexto 
                                            backgroundColor={backgroundOpacityBallon} 
                                            borderWidth={0} 
                                            children={
                                                <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                    {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                                    <View style={{ flexDirection:"column" }}>
                                                        <TextComponent 
                                                            text={"Valor Pago"} 
                                                            color={textColorPrimary} 
                                                            fontSize={7} textAlign={"auto"} />
                                                        <TextComponent 
                                                            text={StringUtil.formatarMoedaReal(financiamentoPagamento.valorPago.toString())} 
                                                            color={textColorPrimary} 
                                                            fontSize={16} 
                                                            textAlign={"auto"} />
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </View>
                                   
                                </View>
                            </View>

                        <InputText 
                            label={"Valor Pago"} 
                            editable={true} 
                            onChangeText={setValorAserPago}
                            value={valorAserPago}
                            money keyboardType="numeric" />
                        
                        <ButtonComponent nameButton={"RECEBER"} onPress={() => {handlerPagarParcela()}} typeButton={"primary"} width={width - 20} />
                </View>
            }
        </BaseScreens>
    )
}
export default FinanciamentoReceber