import { NavigationProp } from "@/src/navigation/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import BalaoTexto from "../components/balaoTexto";
import ButtonComponent from "../components/button";
import Contato from "../components/contato";
import TextComponent from "../components/text/text";
import { backgroundColorError, backgroundOpacityBallon, backgroundWarning, flatListBorderColor, iconColorPrimary, textColorPrimary } from "../constants/colorsPalette ";
import { useFinanciamentoDataBase } from '../database/useFinanciamentoDataBase';
import { FINANCIAMENTO_PAGAMENTO } from "../types/financiamento";
import { DataUtils } from "../utils/dataUtil";
import { IconsUtil } from "../utils/iconsUtil";
import { StringUtil } from "../utils/stringUtil";
import BaseScreens from "./BaseScreens";


const FinanciamentoPagamento = () => {

    const route = useRoute();
    const { cliente, idFinanciamento  }: any = route.params ?? {}

    const navigation = useNavigation<NavigationProp>();

    const financiamentoDataBase = useFinanciamentoDataBase(); 

    const [financiamentoPagamento, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    
    const width = Dimensions.get("screen").width

    useEffect(() => {
        const fetchParcelas = async () => {
            const parcelas = await financiamentoDataBase.buscarParcelasDeFinanciamentoPorId(idFinanciamento);
            const parcelasComCliente = parcelas.map((parcela: any) => ({
                ...parcela,
                cliente: cliente
            }));
            setFinanciamentoPagamento(parcelasComCliente);
        };
        fetchParcelas();
    },[])

    return(
        <BaseScreens title={`${cliente.firstName    } - Contrato ${idFinanciamento.substring(0, idFinanciamento.indexOf('-'))}`} rolbackStack>
            <View style={{ gap: 20, display: 'flex', flexDirection:'column', height:'100%', justifyContent:"center",  }}>

                <FlatList 
                    data={financiamentoPagamento} 
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
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
                            backgroundColor: DataUtils.calcularDiasEntreDatas(item.dataVencimento, new Date()) > 0 && item.dataPagamento === null ? backgroundColorError : backgroundWarning
                        }}>
                            <View style={{ display: DataUtils.calcularDiasEntreDatas(item.dataVencimento, new Date()) > 0 && item.dataPagamento === null ? "flex" : "none", flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
                                <Contato 
                                    telefoneNumero={item.cliente.contact} 
                                    mensagem={StringUtil.formatarMensagemPagamentoAtrasado({
                                        financiamentoPagamento: item,
                                        idContrato: idFinanciamento.toString(),
                                        nomeCliente: cliente.firstName
                                    })}
                                />
                            </View>

                            <View style={{ display: DataUtils.calcularDiasEntreDatas(item.dataVencimento, new Date()) > 0 && item.dataPagamento === null ? "flex" : "none", flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
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
                                                        text={item.numeroParcela.toString()} 
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
                                                        text={DataUtils.formatarDataBR(item.dataVencimento)} 
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
                                                        text={`${item.juros}%`} 
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
                                                        text={`${item.jurosAtraso}%`} 
                                                        color={textColorPrimary} 
                                                        fontSize={14} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>
                            </View>

                            <View style={{ display: DataUtils.calcularDiasEntreDatas(item.dataVencimento, new Date()) > 0 && item.dataPagamento === null ? "flex" : "none", flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
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
                                                        text={DataUtils.calcularDiasEntreDatas(item.dataVencimento, new Date()).toString()} 
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
                                                        text={StringUtil.formatarMoedaReal(item.valorParcela.toString())} 
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
                                                        text={StringUtil.formatarMoedaReal(item.valorAtual.toString())} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>
                            </View>
                            
                            <View style={{ display: DataUtils.calcularDiasEntreDatas(item.dataVencimento, new Date()) > 0 && item.dataPagamento === null ? "flex" : "none", flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
                                
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
                                                        text={StringUtil.formatarMoedaReal(item.valorPago.toString())} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>
                                <View style={{ width:150}}>
                                    <ButtonComponent nameButton={"RECEBER"} onPress={() => {navigation.navigate('FinanciamentoReceber', {idFinanciamento: idFinanciamento, idParcela: item.id, cliente: cliente })}} typeButton={"primary"} width={150} height={55} />
                                </View>
                            </View>
                            
                            <View style={{ display: DataUtils.calcularDiasEntreDatas(item.dataVencimento, new Date()) > 0 && item.dataPagamento !== null ? "flex" : "none", flexDirection: "row", gap:10, width:"100%"}}>
                                <View style={{ width:50}}>
                                    <BalaoTexto 
                                        backgroundColor={backgroundOpacityBallon} 
                                        borderWidth={0} 
                                        children={
                                            <View style={{ flexDirection:"column", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                
                                                <TextComponent 
                                                        text={"Parcela"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"center", width:"100%" }}>
                                                    {IconsUtil.numeroParcela({size: 15, color: iconColorPrimary })}
                                                    <TextComponent 
                                                        text={item.numeroParcela.toString()} 
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
                                                        text={"Data do Pagamento"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={DataUtils.formatarDataBR(item.dataPagamento ?? new Date())} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View> 
                                <View style={{ width:145}}>
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
                                                        text={StringUtil.formatarMoedaReal(item.valorPago.toString())} 
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
                    )}            
                    />
                
            </View>
        </BaseScreens>
    )
}
export default FinanciamentoPagamento