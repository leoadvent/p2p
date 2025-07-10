import { useFinanciamentoDataBase } from "@/database/useFinanciamentoDataBase";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import BalaoTexto from "../components/balaoTexto";
import TextComponent from "../components/text/text";
import { backgroundColorError, backgroundOpacityBallon, backgroundSuccess, flatListBorderColor, iconColorPrimary, textColorPrimary } from "../constants/colorsPalette ";
import { FINANCIAMENTO, MODALIDADE } from "../types/financiamento";
import { DataUtils } from "../utils/dataUtil";
import { IconsUtil } from "../utils/iconsUtil";
import { StringUtil } from "../utils/stringUtil";
import BaseScreens from "./BaseScreens";



const FinanciamentoVisualizacao = () => {

    const [financiamentos, setFinanciamentos] = useState<FINANCIAMENTO[]>([])

    const dimensions = Dimensions.get("window");
    const route = useRoute();
    const { cliente, financiamentoTipo  }: any = route.params ?? {}

    const financiamentoDataBase = useFinanciamentoDataBase();

    async function handlerBuscarFinanciamentoCliente(){
        const financiamentos = await financiamentoDataBase.buscarFinanciamentoPorCliente(cliente.id, financiamentoTipo);
        setFinanciamentos(
            financiamentos.map((f: any) => ({
                ...f,
                cliente: cliente,
                pagamentos: f.pagamentos ?? []
            }))
        );
    }

    useEffect(() => {handlerBuscarFinanciamentoCliente()}, [])

    return(
        <BaseScreens title={`Financiamentos de ${cliente.firstName} ${financiamentoTipo}`} rolbackStack>
            <View style={{ gap: 20, display:'flex', flexDirection:'column', height:'100%', justifyContent:"space-between" }}>

                <FlatList 
                    data={financiamentos} 
                    keyExtractor={(item) => item.id}
                    renderItem={({ item })  => (
                        <View style={{ 
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 20,
                            width: 350, 
                            borderWidth: 1, 
                            marginBottom: 30,
                            borderBottomColor: flatListBorderColor,
                            borderRadius: 10,
                            padding: 10,
                            backgroundColor: item.atrasado  ? backgroundColorError : backgroundSuccess
                        }}>
                            <View style={{ flexDirection: "row", gap:10, width:"100%", justifyContent:"space-between"}}>
                                <View style={{ width:150}}>
                                    <BalaoTexto 
                                        backgroundColor={backgroundOpacityBallon} 
                                        borderWidth={0} 
                                        children={
                                            <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                {IconsUtil.contrato({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Contrato"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={item.id.substring(0, item.id.indexOf('-'))} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>

                                <View style={{ width:150}}>
                                    <BalaoTexto 
                                        backgroundColor={backgroundOpacityBallon} 
                                        borderWidth={0} 
                                        children={
                                            <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                {IconsUtil.modalidade({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Tipo Financiamento"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={item.modalidade === MODALIDADE.CarenciaDeCapital ? "Carência" : "Parcelado"} 
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
                                                {IconsUtil.calendarioNumero({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Data Início"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={DataUtils.formatarDataBR(item.dataInicio)} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>

                                <View style={{ width:150}}>
                                    <BalaoTexto 
                                        backgroundColor={backgroundOpacityBallon} 
                                        borderWidth={0} 
                                        children={
                                            <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                {IconsUtil.calendarioNumero({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Data Fim"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={DataUtils.formatarDataBR(item.dataFim)} 
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
                                            <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center", gap: 10 }}>
                                                {IconsUtil.iconTaxa({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Taxa Juros"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={`${item.taxaJuros} %`} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                                 <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Taxa Atraso"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={`${item.taxaJurosAtraso} %`} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>

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
                                                        text={"Valor Financiado"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={StringUtil.formatarMoedaReal(item.valorFinanciado.toString())} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>

                                <View style={{ width:150}}>
                                    <BalaoTexto 
                                        backgroundColor={backgroundOpacityBallon} 
                                        borderWidth={0} 
                                        children={
                                            <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Valor Montante"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={StringUtil.formatarMoedaReal(item.valorMontante.toString())} 
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
                                {item.modalidade === MODALIDADE.CarenciaDeCapital && 
                                <View style={{ width:150}}>
                                    <BalaoTexto 
                                        backgroundColor={backgroundOpacityBallon} 
                                        borderWidth={0} 
                                        children={
                                            <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Valor da Diária"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={StringUtil.formatarMoedaReal(item.valorDiaria.toString())} 
                                                        color={textColorPrimary} 
                                                        fontSize={16} 
                                                        textAlign={"auto"} />
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>
                                }
                                <View style={{ width:150}}>
                                    <BalaoTexto 
                                        backgroundColor={backgroundOpacityBallon} 
                                        borderWidth={0} 
                                        children={
                                            <View style={{ flexDirection:"row", justifyContent:"space-evenly", width:'100%', alignItems:"center" }}>
                                                {IconsUtil.periodicidade({size: 25, color: iconColorPrimary })}
                                                <View style={{ flexDirection:"column" }}>
                                                    <TextComponent 
                                                        text={"Periodicidade"} 
                                                        color={textColorPrimary} 
                                                        fontSize={7} textAlign={"auto"} />
                                                    <TextComponent 
                                                        text={item.periodocidade} 
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
export default FinanciamentoVisualizacao