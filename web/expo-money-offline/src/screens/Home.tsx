import { useState } from "react";
import { FlatList, View } from "react-native";
import ButtonComponent from "../components/button";
import { Contador } from "../components/contadorCliente";
import ModalSystem from "../components/modal";
import TextComponent from "../components/text/text";
import { backgroundPrimary, balaoBarColorPrimary, textColorPrimary } from "../constants/colorsPalette ";
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase";
import BaseScreens from "./BaseScreens";

const Home = () => {

    const useFinanciamento = useFinanciamentoDataBase();

    const [executadoCalculoJuros, setExecutadoCalculoJuros] = useState<boolean>(false)

    return (
        <BaseScreens title={"HOME"} 
            showChildrenParan
            backgroundColor={backgroundPrimary}
            childrenParam={
            <View style={{ height:150 }}>
                
            </View>
        }>
                            
            <FlatList 
                horizontal
                data={[1, 2, 3]} 
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
                    </View>
                )}               
            />

    
                <ButtonComponent
                    nameButton={"ATUALIZAR JUROS"}
                    onPress={async () => {
                        await useFinanciamento.atualizarValorParcelaCarenciaCapital();
                        const result = await useFinanciamento.atualizarPagamentosAtrasados();
                        setExecutadoCalculoJuros(result);
                    }}
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