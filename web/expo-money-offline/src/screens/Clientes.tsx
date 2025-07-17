import { useState } from "react"
import { View } from "react-native"
import InputText from "../components/input"
import ListarCliente from "../components/listarCliente"
import BaseScreens from "./BaseScreens"

const MeusClientes = () => {

    const [nomeFiltroParam, setNomeFiltroParam] = useState<string>("")

    return (
        <BaseScreens 
            title=""             
            childrenParam={
                <View style={{ height: 100, paddingTop:20 }}>
                    <InputText placeholder="Filtro cliente por nome" onChangeText={setNomeFiltroParam} value={nomeFiltroParam} label={"Nome Filtro"} editable={true} />
                </View>
            }
            showChildrenParan={true} 
            isDrawer={true}>
            <ListarCliente
                setNomeFiltroParam={setNomeFiltroParam}
                nomeFiltroParam={nomeFiltroParam}
            />
        </BaseScreens>
    )
}
export default MeusClientes