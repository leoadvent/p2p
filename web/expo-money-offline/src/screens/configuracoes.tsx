import { useEffect, useState } from "react"
import { View } from "react-native"
import ButtonComponent from "../components/button"
import InputText from "../components/input"
import { borderCollor } from "../constants/colorsPalette "
import { useFinanciadorDataBase } from "../database/useFinanciador"
import { FINANCIADOR } from "../types/financiador"
import BaseScreens from "./BaseScreens"

const Configuracoes = () => {

    const useFinanciador = useFinanciadorDataBase()
    
    const [financiador, setFinanciador] = useState<FINANCIADOR>({} as FINANCIADOR)
    
    async function handlerBuscarFinanciador(){
            setFinanciador( await useFinanciador.recuperarFinanciador())
    }

    function atualizarFinanciador(){
        useFinanciador.atualizarFinanciador(financiador);
    }
    
    useEffect(() => {
            handlerBuscarFinanciador()
        },[])
        
    return(
        <BaseScreens  title={"CONFIGURAÇÕES"} rolbackStack>

            <View style={{ flexDirection: "column", gap: 10, padding:20, borderRadius:20, marginTop: 10, borderWidth: 1, borderColor: borderCollor}}>
                <InputText 
                    width={300} 
                    label={"Nome"} 
                    placeholder="Digite Nome"
                    onChangeText={(text) => setFinanciador( prev => ({...prev, firstName: text}))} 
                    value={financiador.firstName}
                    editable={true} 
                />
                
                <InputText 
                    width={300} 
                    label={"Sobrenome"} 
                    placeholder="Digite Sobrenome"
                    onChangeText={(text) => setFinanciador(prev => ({...prev, lastName: text}))}
                    value={financiador.lastName}
                    editable={true} 
                />
                <ButtonComponent nameButton={"SALVAR"} onPress={() => {atualizarFinanciador()}} typeButton={"primary"} width={300} />
            </View>
        </BaseScreens>
    )
}
export default Configuracoes