import { iconColorDanger, iconColorPrimary, textColorPrimary } from "@/src/constants/colorsPalette "
import { useCustomerDataBase } from "@/src/database/useCustomerDataBase"
import { useFinanciamentoDataBase } from "@/src/database/useFinanciamentoDataBase"
import { IconsUtil } from "@/src/utils/iconsUtil"
import { useState } from "react"
import { View } from "react-native"
import { AnimacaoNumero } from "../animacaoNumero"
import TextComponent from "../text/text"

interface Props {
    tipo: "CLIENTE" | "CONTRATO" | "CONTRATO ATRASADO"
}
export function Contador ( { tipo } : Props)  {

    const [contador, setContador] = useState<number>(0)
    const [icon, setIcon] = useState<any>()

        if(tipo === "CLIENTE"){
            useCustomerDataBase().contadorDeCliente().then((response) => {
                setContador(response)
                setIcon(IconsUtil.cliente({size: 25, color:iconColorPrimary}))
            })
        }else if ( tipo === "CONTRATO"){
            useFinanciamentoDataBase().contadorContratosAberto().then((response) => {
                setContador(response)
                setIcon(IconsUtil.contrato({size: 25, color:iconColorPrimary}))
            })
        }else if( tipo === "CONTRATO ATRASADO" ){
            useFinanciamentoDataBase().contadorContratosAtrasados().then((response) => {
                setContador(response)
                setIcon(IconsUtil.contrato({size: 25, color:iconColorDanger}))
            })
        }
       

   
    
    return(
        <View style={{ alignItems:"center", flexDirection:"row", gap: 10, justifyContent:"center"}}>
            {icon}
            <View>
                <TextComponent text={`Total de ${tipo.toLowerCase()}`} color={textColorPrimary} fontSize={12} textAlign={"center"} />
                <AnimacaoNumero toValue={contador} duration={5000} />
            </View>
        </View>
    )
}

export function ContadorContratoAtivo(){

    const[contador, setContador] = useState<number>(0)

    useFinanciamentoDataBase().contadorContratosAberto().then((response) => {
        setContador(response)
    })
}
