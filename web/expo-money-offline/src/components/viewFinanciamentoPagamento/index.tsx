import { backgroundColorError, backgroundOpacityBallon, backgroundSuccess, backgroundWarning, flatListBorderColor, iconColorPrimary, textColorPrimary } from "@/src/constants/colorsPalette "
import { NavigationProp } from "@/src/navigation/navigation"
import { CUSTOMER } from "@/src/types/customer"
import { FINANCIAMENTO_PAGAMENTO, MODALIDADE } from "@/src/types/financiamento"
import { DataUtils } from "@/src/utils/dataUtil"
import { IconsUtil } from "@/src/utils/iconsUtil"
import { StringUtil } from "@/src/utils/stringUtil"
import { useNavigation } from "@react-navigation/native"
import { Dimensions, TouchableOpacity, View } from "react-native"
import BalaoTexto from "../balaoTexto"
import ButtonComponent from "../button"
import Contato from "../contato"
import ShowImageCliente from "../imageAvatar"
import TextComponent from "../text/text"

interface Props {
    pagamento: FINANCIAMENTO_PAGAMENTO,
    idFinanciamento: string,
    cliente: CUSTOMER,
    isNegociar: boolean,
    isNotificacaoVencimento: boolean,
    isReceber: boolean,
    isMostraCliente: boolean,
}
const FinanciamentoPagamentoView = ({ pagamento, idFinanciamento, cliente, isNegociar, isReceber, isMostraCliente, isNotificacaoVencimento } : Props ) => {

    //alert(JSON.stringify(pagamento))
    const width = Dimensions.get("screen").width
    const navigation = useNavigation<NavigationProp>();
    return(
        <View style={{ 
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            width: width - 20, 
            borderWidth: 1, 
            marginBottom: 20,
            borderBottomColor: flatListBorderColor,
            borderRadius: 5,
            padding: 10,
            backgroundColor: DataUtils.calcularDiasEntreDatas(pagamento.dataVencimento, new Date()) > 0 && pagamento.dataPagamento === null ? backgroundColorError : pagamento.dataPagamento != null ? backgroundSuccess : backgroundWarning
        }}>
            
            <View style={{ display:"flex" , gap: 10 , flexDirection:"row" }}>
                <View>
                    {DataUtils.calcularDiasEntreDatas(pagamento.dataUltimoPagamento, new Date()) <= 0 &&
                    <Contato 
                        telefoneNumero={cliente.contact} 
                        mensagem={StringUtil.formatarMensagemNotificacaoVencimento({
                                    financiamentoPagamento: pagamento,
                                    idContrato: idFinanciamento.toString(),
                                    nomeCliente: cliente.firstName
                                })}
                    />
                    }
                </View>
                <ShowImageCliente 
                    urlPhoto={cliente.photo} 
                    amountFinancialLoansPending={0} 
                    width={80}
                    height={80}
                    firsName={cliente.firstName} lastName={cliente.lastName} />
                <View>
                    <TextComponent text={cliente.firstName} color={textColorPrimary} fontSize={24} textAlign={"center"} />
                    <TextComponent text={cliente.lastName} color={textColorPrimary} fontSize={14} textAlign={"center"} />
                    <TextComponent text={pagamento.modalidade} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                </View>
            </View>
            
            <View style={{ display: pagamento.dataPagamento === null ? "flex" :"none", gap: 10 }}>
                <View style={{ display: DataUtils.calcularDiasEntreDatas(pagamento.dataVencimento, new Date()) > 0 && pagamento.dataPagamento === null ? "flex" : "none", flexDirection: "row", justifyContent:"space-between", width:"100%"}}>
                    <Contato 
                        telefoneNumero={cliente.contact} 
                        mensagem={StringUtil.formatarMensagemPagamentoAtrasado({
                                    financiamentoPagamento: pagamento,
                                    idContrato: idFinanciamento.toString(),
                                    nomeCliente: cliente.firstName
                                })}
                    />
                    {}
                    <TouchableOpacity onPress={() => {navigation.navigate('FinanciamentoNegociar', {idFinanciamento: idFinanciamento, idParcela: pagamento.id, cliente: cliente })}}>
                        <BalaoTexto 
                            children={<TextComponent text={"NEGOCIAR"} color={textColorPrimary} fontSize={16} textAlign={"center"} />} 
                            backgroundColor={backgroundWarning} 
                            width={200}
                            borderWidth={1} />
                    </TouchableOpacity>
                </View>
            
                <View style={{ gap: 20, display: 'flex', flexDirection:'row', justifyContent:"center",  }}>
                    <View style={{ width:60}}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column", justifyContent:"center", width:'100%', alignItems:"center" }}>
                                    
                                    <TextComponent 
                                            text={"Parcela"} 
                                            color={textColorPrimary} 
                                            fontSize={7} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", width:"100%" }}>
                                        {IconsUtil.numeroParcela({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={pagamento.numeroParcela.toString()} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    <View style={{ width:120, alignItems:"center" }}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            width={122}
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column",  width:'118%', justifyContent:"center" }}>
                                    <TextComponent 
                                            text={"Data de Vencimento"} 
                                            color={textColorPrimary} 
                                            fontSize={7} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", gap: 4 }}>
                                        {IconsUtil.calendarioNumero({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={DataUtils.formatarDataBR(pagamento.dataVencimento)} 
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
                                                text={`${pagamento.juros}%`} 
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
                                                text={`${pagamento.jurosAtraso}%`} 
                                                color={textColorPrimary} 
                                                fontSize={14} 
                                                textAlign={"auto"} />
                                        </View>
                                </View>
                            }
                        />
                    </View>
                </View>
                
                <View style={{ gap: 20, display: 'flex', flexDirection:'row', justifyContent:"center",  }}>
                    <View style={{ display: pagamento.modalidade !== MODALIDADE.CarenciaDeCapital ? "flex": "none", width:60}}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column", justifyContent:"center", width:'100%', alignItems:"center" }}>
                                    
                                    <TextComponent 
                                            text={"Dias atrasado"} 
                                            color={textColorPrimary} 
                                            fontSize={5} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", width:"100%" }}>
                                        {IconsUtil.dia({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={DataUtils.calcularDiasEntreDatas(pagamento.dataVencimento, new Date()).toString()} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                    </View>

                    <View style={{ display: pagamento.modalidade === MODALIDADE.CarenciaDeCapital ? "flex": "none", width:60}}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column", justifyContent:"center", width:'100%', alignItems:"center" }}>
                                   
                                    <TextComponent 
                                            text={"Dias Corridos"} 
                                            color={textColorPrimary} 
                                            fontSize={5} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", width:"100%", gap: 2 }}>
                                        {IconsUtil.diaCorrido({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={DataUtils.calcularDiasEntreDatas(pagamento.dataUltimoPagamento, new Date()).toString()} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    <View style={{ display: pagamento.modalidade === MODALIDADE.CarenciaDeCapital ? "flex": "none", width:120, alignItems:"center" }}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            width={122}
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column",  width:'118%', justifyContent:"center" }}>
                                    <TextComponent 
                                            text={"Valor Diária"} 
                                            color={textColorPrimary} 
                                            fontSize={7} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", gap: 4 }}>
                                        {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={StringUtil.formatarMoedaReal(pagamento.valorDiaria.toString())} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    <View style={{ display: pagamento.modalidade !== MODALIDADE.CarenciaDeCapital ? "flex": "none", width:120, alignItems:"center" }}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            width={122}
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column",  width:'118%', justifyContent:"center" }}>
                                    <TextComponent 
                                            text={"Valor parcela"} 
                                            color={textColorPrimary} 
                                            fontSize={7} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", gap: 4 }}>
                                        {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={StringUtil.formatarMoedaReal(pagamento.valorParcela.toString())} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    <View style={{ width:120, alignItems:"center" }}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            width={122}
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column",  width:'118%', justifyContent:"center" }}>
                                    <TextComponent 
                                            text={"Valor atual"} 
                                            color={textColorPrimary} 
                                            fontSize={7} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", gap: 4 }}>
                                        {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={StringUtil.formatarMoedaReal(pagamento.valorAtual.toString())} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    
                </View>

                <View style={{ gap: 20, display: 'flex', flexDirection:'row', width:"100%", justifyContent:"space-between" }}>
                    
                    <View style={{ display: pagamento.modalidade === MODALIDADE.CarenciaDeCapital ? "flex": "none", width:60}}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column", justifyContent:"center", width:'100%', alignItems:"center" }}>
                                    
                                    <TextComponent 
                                            text={"Dias atrasado"} 
                                            color={textColorPrimary} 
                                            fontSize={5} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", width:"100%" }}>
                                        {IconsUtil.dia({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={DataUtils.calcularDiasEntreDatas(pagamento.dataVencimento, new Date()).toString()} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                    </View>

                    <View style={{ display: pagamento.modalidade === MODALIDADE.CarenciaDeCapital ? "flex": "none", width:120, alignItems:"center" }}>
                        <View style={{ width:120, alignItems:"center" }}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            width={122}
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column",  width:'118%', justifyContent:"center" }}>
                                    <TextComponent 
                                            text={"Data último Pagamento"} 
                                            color={textColorPrimary} 
                                            fontSize={7} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", gap: 4 }}>
                                        {IconsUtil.calendarioNumero({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={DataUtils.formatarDataBR(pagamento.dataUltimoPagamento)} 
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

                <View style={{ gap: 20, display: 'flex', flexDirection:'row', width:"100%", justifyContent:"space-between" }}>
                    
                    <View style={{ width:120, flexDirection:"row" }}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            width={150}
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"column",  width:'100%' }}>
                                    <TextComponent 
                                            text={"Valor pago"} 
                                            color={textColorPrimary} 
                                            fontSize={7} textAlign={"auto"} />
                                    <View style={{ flexDirection:"row", gap: 4 }}>
                                        {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                        <TextComponent 
                                            text={StringUtil.formatarMoedaReal(pagamento.valorPago.toString())} 
                                            color={textColorPrimary} 
                                            fontSize={16} 
                                            textAlign={"auto"} />
                                    </View>
                                </View>
                            }
                        />
                        
                    </View>
                    <View style={{ display: isReceber ? 'flex' : 'none', width:150}}>
                        <ButtonComponent nameButton={"RECEBER"} onPress={() => {navigation.navigate('FinanciamentoReceber', {idFinanciamento: idFinanciamento, idParcela: pagamento.id, cliente: cliente })}} typeButton={"primary"} width={150} height={55} />
                    </View>
                    <View style={{ display: !isReceber  && pagamento.modalidade === MODALIDADE.CarenciaDeCapital? 'flex' : 'none', width:150}}>
                            <View style={{ width:120, flexDirection:"row" }}>
                                <BalaoTexto 
                                    backgroundColor={backgroundOpacityBallon} 
                                    width={150}
                                    borderWidth={0} 
                                    children={
                                        <View style={{ flexDirection:"column",  width:'100%' }}>
                                            <TextComponent 
                                                    text={"Valor para quitar"} 
                                                    color={textColorPrimary} 
                                                    fontSize={7} textAlign={"auto"} />
                                            <View style={{ flexDirection:"row", gap: 4 }}>
                                                {IconsUtil.dinheiro({size: 25, color: iconColorPrimary })}
                                                <TextComponent 
                                                    text={StringUtil.formatarMoedaReal(pagamento.valorParcela.toString())} 
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
            </View>

             <View style={{ display: pagamento.dataPagamento !== null ? "flex" : "none", flexDirection: "row", gap:10, width:"100%"}}>
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
                                        text={pagamento.numeroParcela.toString()} 
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
                                        text={DataUtils.formatarDataBR(pagamento.dataPagamento ?? new Date())} 
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
                                        text={StringUtil.formatarMoedaReal(pagamento.valorPago.toString())} 
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
    )
}
export default FinanciamentoPagamentoView