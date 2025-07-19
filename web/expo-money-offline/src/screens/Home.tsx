import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import ButtonComponent from "../components/button";
import { Contador } from "../components/contadorCliente";
import ModalSystem from "../components/modal";
import TextComponent from "../components/text/text";
import { backgroundPrimary, balaoBarColorPrimary, iconColorPrimary, iconColorWarning, textColorDeactivated, textColorPrimary } from "../constants/colorsPalette ";
import { useFinanciadorDataBase } from "../database/useFinanciador";
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase";
import { NavigationProp } from "../navigation/navigation";
import { FINANCIADOR } from "../types/financiador";
import { IconsUtil } from "../utils/iconsUtil";
import BaseScreens from "./BaseScreens";

const Home = () => {

    const useFinanciamento = useFinanciamentoDataBase();
    const useFinanciador = useFinanciadorDataBase()

    const [executadoCalculoJuros, setExecutadoCalculoJuros] = useState<boolean>(false)
    const [atualizar, setAtualizar] = useState<boolean>(false)
    const [financiador, setFinanciador] = useState<FINANCIADOR>({} as FINANCIADOR)

    const navigation = useNavigation<NavigationProp>();

    async function handlerBuscarFinanciador(){
        setFinanciador( await useFinanciador.recuperarFinanciador())
    }

    async function handlerCalcularJuros(){
        await useFinanciamento.atualizarValorParcelaCarenciaCapital();
        const result = await useFinanciamento.atualizarPagamentosAtrasados();
        setExecutadoCalculoJuros(result);
    }

    useEffect(() => {
        handlerBuscarFinanciador()
        handlerCalcularJuros()
    },[atualizar])

    return (
        <BaseScreens title={""} 
            showChildrenParan
            backgroundColor={backgroundPrimary}
            childrenParam={
            <View style={{ height:150 }}>
                
                <View style={{ flexDirection: "row", justifyContent:"space-between", padding:10, gap:10}}>
                    
                    <View style={{ flexDirection: "row", justifyContent:"flex-start", alignItems:"center", padding:10, gap:10, width:150}}>
                        {IconsUtil.pessoa({size:20, color: iconColorWarning})}
                        <TextComponent text={`Olá, ${financiador.firstName}`} color={textColorPrimary} fontSize={18} textAlign={"left"} />
                    </View>
                    
                    <View style={{ flexDirection: "row", alignItems:"flex-end", padding:10, gap:20, }}>
                        
                        <TouchableOpacity
                            onPress={() => { setAtualizar(!atualizar) }}
                        >
                            {IconsUtil.atualizar({size:25, color: iconColorPrimary})}
                        </TouchableOpacity>
                        
                        {IconsUtil.olhoAberto({size:25, color: iconColorPrimary})}
                        
                        <TouchableOpacity
                            onPress={() => { navigation.navigate('Configuracoes', {})}}
                        >
                            {IconsUtil.ferramentas({size:25, color: iconColorWarning})}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent:"space-between", padding:10, gap:10}}>
                    <TextComponent text={`Bem Vindo ${financiador.firstName} ${financiador.lastName}`} color={"rgb(247, 238, 238)"} fontSize={10} textAlign={"right"} />
                </View>

                <View style={{ flexDirection: "row", justifyContent:"space-between",  gap:10}}>
                    <Image source={require("../../assets/images/logo.png")}
                        style={{
                            height: 45,
                            width: 45,
                            alignSelf:"baseline",
                            objectFit:"fill"
                        }}
                    />

                    <TextComponent text={"APP P2P"} fontWeight={"800"} color={textColorDeactivated} fontSize={24} textAlign={"auto"} />
                </View>
                
            </View>
        }>
                            
            <FlatList 
                horizontal
                data={[1, 2, 3, 4]} 
                renderItem={({ item }) => (
                    <View style={{
                        width:200,
                        height:65,
                        padding:10,
                        backgroundColor: balaoBarColorPrimary,
                        borderRadius: 25,
                        margin: 10
                    }}>
                        {item === 1 && <Contador tipo="CLIENTE" />}
                        {item === 2 && <Contador tipo="CONTRATO" />}
                        {item === 3 && <Contador tipo="CONTRATO ATRASADO" />}
                        {item === 4 && <Contador tipo="FINALIZADO" />}
                    </View>
                )}               
            />

    
                <ButtonComponent
                    nameButton={"ATUALIZAR JUROS"}
                    onPress={async () => { handlerCalcularJuros() }}
                    typeButton={"primary"}
                    width={330}
                    height={60}
                />
                    
            
            <ModalSystem 
                title={"JUROS ATUALIZADOS"} 
                setVisible={setExecutadoCalculoJuros} 
                heightProp={500}
                visible={executadoCalculoJuros} 
                children={
                    <View style={{ width:200, gap: 50 }}>
                        <TextComponent text={"A atualização do calculo de juros de parcelas em atraso foi realizado com sucesso"} color={textColorPrimary} fontSize={14} textAlign={"center"} />

                        <ButtonComponent nameButton={"FECHAR"} onPress={() => setExecutadoCalculoJuros(false)} typeButton={"primary"} width={200} />
                    </View>
                } 
            />
        </BaseScreens>
    )
}

export default Home;