import { backgroundBlue, backgroundOpacityBallon, iconColorDanger, iconColorSuccess, iconColorWarning, textColorPrimary } from "@/src/constants/colorsPalette ";
import { NavigationProp } from "@/src/navigation/navigation";
import { CUSTOMER } from "@/src/types/customer";
import { IconsUtil } from "@/src/utils/iconsUtil";
import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";
import { TIPOFINANCIAMENTO } from '../../types/tiposFinanciamento';
import BalaoTexto from "../balaoTexto";
import ShowImageCliente from "../imageAvatar";
import TextComponent from "../text/text";


interface Props {
    customer: CUSTOMER
    setModalVisible: Dispatch<SetStateAction<boolean>>
}

const DetalharCliente = ({ customer, setModalVisible } : Props) => {

    const navigation = useNavigation<NavigationProp>();
    
    return(
        <View style={{ display: "flex", flexDirection: "column", gap: 10, alignItems:"center" }}>
                    <ShowImageCliente
                        urlPhoto={customer.photo}
                        amountFinancialLoansPending={0}
                        firsName={customer.firstName}
                        lastName={customer.lastName}
                        width={160}
                        height={160}
                    />

                    <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('FinanciamentoVisualizacao', {cliente: customer, financiamentoTipo: TIPOFINANCIAMENTO.aberto})}}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0.7}                        
                            children={
                                <View style={{ width: 250, flexDirection:"row", alignItems:"center"}}>
                                    {IconsUtil.contrato({size: 25, color:iconColorSuccess})}
                                    <TextComponent text={`Contratos em Aberto: ${customer.totalParcelasAbertas}`} color={textColorPrimary} fontSize={16} textAlign={"center"} />
                                </View>
                            }               
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('FinanciamentoVisualizacao', {cliente: customer, financiamentoTipo: TIPOFINANCIAMENTO.pendente })}}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0.7}                        
                            children={
                                <View style={{ width: 250, flexDirection:"row", alignItems:"center"}}>
                                    {IconsUtil.contrato({size: 25, color:iconColorWarning})}
                                    <TextComponent text={`Contratos em Pendente: ${customer.totalParcelasPendente}`} color={textColorPrimary} fontSize={16} textAlign={"center"} />
                                </View>
                            }               
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('FinanciamentoVisualizacao', {cliente: customer, financiamentoTipo: TIPOFINANCIAMENTO.atrasado})}}>
                        <BalaoTexto 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0.7}                        
                            children={
                                <View style={{ width: 250, flexDirection:"row", alignItems:"center"}}>
                                    {IconsUtil.contrato({size: 25, color:iconColorDanger})}
                                    <TextComponent text={`Contratos em Atraso: ${customer.totalParcelasAtrasadas}`} color={textColorPrimary} fontSize={16} textAlign={"center"} />
                                </View>
                            }               
                        />
                    </TouchableOpacity>
                    
                    <View style={{ width: 'auto', flexDirection:"row", gap:10}}>
                        <TouchableOpacity onPress={() => {setModalVisible(false); navigation.navigate("CriarEditarClientes", { clientEdit: customer })}}>
                           <BalaoTexto 
                                backgroundColor={backgroundBlue} 
                                borderWidth={0}
                                width={90}
                                children={<View style={{ alignItems:"center", gap:10}}>
                                    <TextComponent text={"Editar Cliente"} color={textColorPrimary} fontSize={10} textAlign={"auto"}  />
                                    {IconsUtil.editar({size:30, color: iconColorWarning})}
                                </View>} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setModalVisible(false); navigation.navigate("Financiamento", { clientFinanciamento: customer })}}>
                            <BalaoTexto 
                                backgroundColor={backgroundBlue} 
                                borderWidth={0}
                                width={90}
                                children={<View style={{ alignItems:"center", gap:10}}>
                                    <TextComponent text={"Financiar"} color={textColorPrimary} fontSize={10} textAlign={"auto"}  />
                                    {IconsUtil.dinheiro({size:30, color: iconColorSuccess})}
                                </View>} />
                        </TouchableOpacity>
                    </View>
                </View>
    )

}
export default DetalharCliente