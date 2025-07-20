import { useEffect, useState } from "react"
import { Dimensions, Image, View } from "react-native"
import ButtonComponent from "../components/button"
import TextComponent from "../components/text/text"
import { statusBarColorPrimary, textColorDeactivated, textColorPrimary } from "../constants/colorsPalette "
import { useFinanciadorDataBase } from "../database/useFinanciador"
import autenticarComBiometria from "../seguranca/AutenticacaoComBiometria"
import { FINANCIADOR } from "../types/financiador"
import BaseScreens from "./BaseScreens"

const BoasVindas = () => {

    const useFinanciador = useFinanciadorDataBase()

    const [financiador, setFinanciador] = useState<FINANCIADOR>({} as FINANCIADOR)
    
    const dimension = Dimensions.get("screen")

    async function handlerBuscarFinanciador(){
        setFinanciador( await useFinanciador.recuperarFinanciador())
    }

    useEffect(() => {
        handlerBuscarFinanciador()
    },[])



    return(
        <BaseScreens isDrawer={false} title={""}>
            <View style={{ display:"flex", borderRadius:20, padding: 20, gap: 20, flex:1, width:dimension.width, backgroundColor: statusBarColorPrimary}}>
                
                <View style={{ flexDirection: "row", justifyContent:"space-between", gap:10}}>
                    <Image source={require("../../assets/images/logo.png")}
                        style={{
                            height: 70,
                            width: 75,
                            alignSelf:"baseline",
                            objectFit:"fill"
                        }}
                    />

                    <TextComponent text={"APP P2P"} fontWeight={"800"} color={textColorDeactivated} fontSize={28} textAlign={"auto"} />
                </View>

                <TextComponent text={`Olá, ${financiador.firstName}, bem vindo ao P2P!`} color={textColorPrimary} fontSize={20} textAlign={"auto"} />
                <ButtonComponent nameButton={"ENTRAR"} onPress={() => autenticarComBiometria()} typeButton={"primary"} width={100} />
            </View>
        </BaseScreens>
    )
}
export default BoasVindas

