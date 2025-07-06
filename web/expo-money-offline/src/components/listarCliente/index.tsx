import { flatListBorderColor, textColorPrimary } from "@/constants/colorsPalette ";
import { useCustomerDataBase } from "@/database/useCustomerDataBase";
import { CUSTOMER } from "@/types/customer";
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import ShowImageCliente from "../imageAvatar";
import TextComponent from "../text/text";

const ListarCliente = () => {

    const [customers, setCustomers] = useState<CUSTOMER[]>([]);
    const [nomeFiltro, setNomeFiltro] = useState<string>("");
    
    const customerDataBase = useCustomerDataBase();

    const width = Dimensions.get("screen").width; // Assuming a fixed width for the FlatList items
    
    async function handlerBuscarClientes() {
        setCustomers(await customerDataBase.buscarPorNome(nomeFiltro));
    }

    useFocusEffect(
        React.useCallback(() => {
            handlerBuscarClientes();
        }, [])
    )

    console.log("ListarCliente - customers", customers);

    return (
        <View>
            <TextComponent text={"LISTAR CLIENTES"} color={textColorPrimary} fontSize={7} textAlign={"left"} />

            <FlatList 
                data={customers} 
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ 
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 20,
                                    width: width-40, 
                                    borderWidth: 1, 
                                    marginBottom: 10,
                                    borderBottomColor: flatListBorderColor,
                                    borderRadius: 5,
                                    padding: 10,
                            }}>
                        <ShowImageCliente 
                            width={60}
                            height={60}
                            urlPhoto={item.photo} 
                            amountFinancialLoansPending={0} 
                            firsName={item.firstName} 
                            lastName={item.lastName} 
                        />
                        <TextComponent text={`${item.firstName} ${item.lastName}`} fontSize={18} color={textColorPrimary} textAlign={"auto"} />
                        <TextComponent text={`Contato: ${item.contact}`} fontSize={10} color={textColorPrimary} textAlign={"auto"} />
                    </View>
                )}
            />
        </View>
    );
}
export default ListarCliente;