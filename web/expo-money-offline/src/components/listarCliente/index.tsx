import { useCustomerDataBase } from "@/database/useCustomerDataBase";
import { CUSTOMER } from "@/types/customer";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import TextComponent from "../text/text";

const ListarCliente = () => {

    const [customers, setCustomers] = useState<CUSTOMER[]>([]);
    const [nomeFiltro, setNomeFiltro] = useState<string>("");
    
    const customerDataBase = useCustomerDataBase();
    
    async function handlerBuscarClientes() {
        console.log("Buscar - nomeFiltro", nomeFiltro);
        setCustomers(await customerDataBase.buscarPorNome(nomeFiltro));
    }

    useEffect(() => {handlerBuscarClientes()}, [nomeFiltro]);

    console.log("ListarCliente - customers", customers);

    return (
        <View>
            <TextComponent text={"LISTAR CLIENTES"} color={"rgb(75, 75, 75)"} fontSize={7} textAlign={"left"} />

            <FlatList 
                data={customers} 
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <TextComponent text={`${item.firstName} ${item.lastName}`} fontSize={10} color={"rgb(75, 75, 75)"} textAlign={"auto"} />
                        <TextComponent text={`Contato: ${item.contact}`} fontSize={10} color={"rgb(75, 75, 75)"} textAlign={"auto"} />
                    </View>
                )}
            />
        </View>
    );
}
export default ListarCliente;