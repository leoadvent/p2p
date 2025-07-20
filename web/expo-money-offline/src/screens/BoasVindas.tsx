import { useNavigation } from "@react-navigation/native"
import { useContext, useEffect, useState } from "react"
import { Dimensions, Image, View } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ButtonComponent from "../components/button"
import TextComponent from "../components/text/text"
import { statusBarColorPrimary, textColorDeactivated, textColorPrimary } from "../constants/colorsPalette "
import { AuthContext } from "../context/AuthContext"
import { useFinanciadorDataBase } from "../database/useFinanciador"
import { NavigationProp } from "../navigation/navigation"
import { FINANCIADOR } from "../types/financiador"
import BaseScreens from "./BaseScreens"


const BoasVindas = () => {

    const useFinanciador = useFinanciadorDataBase()

    const [financiador, setFinanciador] = useState<FINANCIADOR>({} as FINANCIADOR)
    
    const dimension = Dimensions.get("window")

    const { Login, logado } = useContext(AuthContext)

    const navigation = useNavigation<NavigationProp>();

    const inset = useSafeAreaInsets();

    async function handlerBuscarFinanciador(){
        setFinanciador( await useFinanciador.recuperarFinanciador())
    }

    useEffect(() => {
        handlerBuscarFinanciador()
    },[])

    useEffect(() => {
        if(logado){navigation.navigate('tabNavigator', {})}
    },[logado])


    return(
        <BaseScreens isDrawer={false} title={""}>
            <View style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", borderRadius:20, padding: 20, gap: 20, flex:1, width: dimension.width, backgroundColor: statusBarColorPrimary}}>
                
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
                <View style={{ width: "100%", marginBottom: inset.bottom}}>
                    <ButtonComponent nameButton={"ENTRAR"} onPress={() => Login()} typeButton={"primary"} width={"auto"} />
                </View>
            </View>
        </BaseScreens>
    )
}
export default BoasVindas

