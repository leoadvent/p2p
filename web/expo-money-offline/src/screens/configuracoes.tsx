import { useEffect, useState } from "react"
import { View } from "react-native"
import ButtonComponent from "../components/button"
import InputText from "../components/input"
import ModalSystem from "../components/modal"
import TextComponent from "../components/text/text"
import { borderCollor, textColorWarning } from "../constants/colorsPalette "
import { useFinanciadorDataBase } from "../database/useFinanciador"
import { useFinanciamentoDataBase } from "../database/useFinanciamentoDataBase"
import { FINANCIADOR } from "../types/financiador"
import BaseScreens from "./BaseScreens"

const Configuracoes = () => {

    const useFinanciador = useFinanciadorDataBase()
    const useFinanciamento = useFinanciamentoDataBase()
    
    const [financiador, setFinanciador] = useState<FINANCIADOR>({} as FINANCIADOR)
    const [showModalDeletaPagamento, setShowModalDeletaPagamento] = useState<boolean>(false)
    
    async function handlerBuscarFinanciador(){
            setFinanciador( await useFinanciador.recuperarFinanciador())
    }

    async function deletarPagamentosFinanciamentosQuitados() {
        await useFinanciamento.deletarPagamentosFinanciamentoQuitado()
        .catch((error) => {alert(error)})
        setShowModalDeletaPagamento(false)
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

            <View style={{ flexDirection: "column", gap: 10, padding:20, borderRadius:20, marginTop: 10, borderWidth: 1, borderColor: borderCollor}}>
                <ButtonComponent nameButton={"DELETAR PAGAMENTO FINANCIAMENTO QUITADO"} onPress={() => {setShowModalDeletaPagamento(!showModalDeletaPagamento)}} typeButton={"error"} width={300} height={80} />
            </View>

            <ModalSystem title={"DELETAR PAGAMENTOS"} 
                heightProp={500}
                children={<View style={{ width:"90%", gap: 20}}>
                    <TextComponent text={"Tem certeza que deseja deletar os pagamentos de financiamentos quitados?"} color={textColorWarning} fontSize={20} textAlign={"center"} />
                    <View style={{ flexDirection:"row", justifyContent:"space-between"}}>
                        <ButtonComponent nameButton={"CONFIRMAR"} onPress={() => {deletarPagamentosFinanciamentosQuitados()}} typeButton={"warning"} width={100} />
                        <ButtonComponent nameButton={"CANCELAR"} onPress={() => {setShowModalDeletaPagamento(false)}} typeButton={"primary"} width={100} />
                    </View>
                </View>} 
                setVisible={setShowModalDeletaPagamento} visible={showModalDeletaPagamento} />
        </BaseScreens>
        
    )
}
export default Configuracoes