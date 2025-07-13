import { useState } from "react";
import { View } from "react-native";
import AlertaVencimento from "../components/alertaVencimento";
import ButtonComponent from "../components/button";
import ModalSystem from "../components/modal";
import TextComponent from "../components/text/text";
import { textColorPrimary } from "../constants/colorsPalette ";
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase";
import BaseScreens from "./BaseScreens";

const Home = () => {

    const useFinanciamento = useFinanciamentoDataBase();

    const [executadoCalculoJuros, setExecutadoCalculoJuros] = useState<boolean>(false)

    return (
        <BaseScreens title={"HOME"}>
            <View>
                <ButtonComponent
                    nameButton={"ATUALIZAR JUROS"}
                    onPress={async () => {
                        await useFinanciamento.atualizarValorParcelaCarenciaCapital();
                        const result = await useFinanciamento.atualizarPagamentosAtrasados();
                        setExecutadoCalculoJuros(result);
                    }}
                    typeButton={"warning"}
                    width={330}
                />
                <TextComponent text={"HOME"} color={"rgb(247, 238, 238)"} fontSize={7} textAlign={"center"} />
            </View>

            
            <AlertaVencimento />
          
            
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