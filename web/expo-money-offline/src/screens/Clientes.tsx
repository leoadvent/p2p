import ListarCliente from "../components/listarCliente"
import BaseScreens from "./BaseScreens"

const MeusClientes = () => {
    return (
        <BaseScreens title="" showChildrenParan={true} isDrawer={true}>
            <ListarCliente />
        </BaseScreens>
    )
}
export default MeusClientes