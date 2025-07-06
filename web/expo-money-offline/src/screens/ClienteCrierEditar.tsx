import FormularioCustomer from "../components/formularioCustomer";
import BaseScreens from "./BaseScreens";

const ClienteCrierEditar = () => {

    return (
        <BaseScreens title="" showChildrenParan={false} isDrawer={true}>
            <FormularioCustomer />
        </BaseScreens>
    )

}

export default ClienteCrierEditar;