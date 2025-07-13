import { backgroundOpacityBallon, textColorPrimary } from "@/src/constants/colorsPalette "
import { useFinanciamentoDataBase } from "@/src/database/useFinanciamentoDataBase"
import { INVESTIMENTO } from "@/src/types/investimento"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { AnimatedNumber } from "../animacaoNumero"
import BalaoTexto from "../balaoTexto"
import TextComponent from "../text/text"

const Investimento = () => {

    const useDataBase = useFinanciamentoDataBase();

    const[investimentos, setInvestimentos] = useState<INVESTIMENTO>({} as INVESTIMENTO)

    async function handerBuscarInvestimentos() {
         setInvestimentos( await useDataBase.buscarInvestimentos())
    }

    useEffect(() => {
        handerBuscarInvestimentos()
    }, [])

    return(
        <View style={{ width: "100%", alignItems:"center" }}>
            <TextComponent text={"Meus Investimentos"} color={textColorPrimary} fontSize={5} textAlign={"auto"} /> 
            {Object.entries(investimentos).length > 0 && 
                <View style={{ flexDirection:"column", gap:20}}>

                    <View style={{ flexDirection: "row", width:"90%", justifyContent:"space-between"}} >
                        <BalaoTexto 
                            children={<TextComponent text={'Total Investido:'} color={textColorPrimary} fontSize={16} textAlign={"auto"} />} 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} />
                        <BalaoTexto 
                            children={
                                <AnimatedNumber
                                toValue={investimentos.totalInvestido} 
                                color={textColorPrimary}
                                fontSize={20}
                                />
                            } 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} />
                    </View>

                     <View style={{ flexDirection: "row", width:"90%", justifyContent:"space-between"}} >
                        <BalaoTexto 
                            children={<TextComponent text={'Total Montante:'} color={textColorPrimary} fontSize={16} textAlign={"auto"} />} 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} />
                        <BalaoTexto 
                            children={
                                <AnimatedNumber
                                toValue={investimentos.totalMontante} 
                                color={textColorPrimary}
                                fontSize={20}
                                />
                            } 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} />
                    </View>

                    <View style={{ flexDirection: "row", width:"90%", justifyContent:"space-between"}} >
                        <BalaoTexto 
                            children={<TextComponent text={'Total Recebido:'} color={textColorPrimary} fontSize={16} textAlign={"auto"} />} 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} />
                        <BalaoTexto 
                            children={
                                <AnimatedNumber
                                toValue={investimentos.totalRecebido} 
                                color={textColorPrimary}
                                fontSize={20}
                                />
                            } 
                            backgroundColor={backgroundOpacityBallon} 
                            borderWidth={0} />
                    </View>
                </View>
            }
        </View>
    )
}
export default Investimento