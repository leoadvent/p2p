import { View } from "react-native";
import ButtonComponent from "../components/button";
import TextComponent from "../components/text/text";
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase";
import BaseScreens from "./BaseScreens";

const Home = () => {

    const useFinanciamento = useFinanciamentoDataBase();

    return (
        <BaseScreens title={"HOME"}>
            <View>
                <ButtonComponent nameButton={"ATUALIZAR JUROS"} onPress={() => {useFinanciamento.atualizarPagamentosAtrasados()}} typeButton={"warning"} width={330} />
                <TextComponent text={"HOME"} color={"rgb(247, 238, 238)"} fontSize={7} textAlign={"center"} />
            </View>
        </BaseScreens>
    )
}

export default Home;