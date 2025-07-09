import { flatListBorderColor, iconColorDanger, iconColorSuccess, iconColorWarning, textColorPrimary, textColorWarning } from "@/constants/colorsPalette ";
import { useCustomerDataBase } from "@/database/useCustomerDataBase";
import { NavigationProp } from "@/src/navigation/navigation";
import { IconsUtil } from "@/src/utils/iconsUtil";
import { CUSTOMER } from "@/types/customer";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import ShowImageCliente from "../imageAvatar";
import ModalSystem from "../modal";
import TextComponent from "../text/text";

const ListarCliente = () => {

    const navigation = useNavigation<NavigationProp>();

    const [customers, setCustomers] = useState<CUSTOMER[]>([]);
    const [customerView, setCustomerView] = useState<CUSTOMER>({} as CUSTOMER);
    const [nomeFiltro, setNomeFiltro] = useState<string>("");

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    
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


    return (
        <View>
            <TextComponent text={"LISTAR CLIENTES"} color={textColorPrimary} fontSize={7} textAlign={"left"} />

            <FlatList 
                data={customers} 
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {setCustomerView(item); setModalVisible(true)}} >
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
                            <View style={{ flexDirection:"column", gap:5, width:19}}>
                                {item.totalParcelasAbertas > 0 && IconsUtil.contrato({size: 20, color: iconColorSuccess})}
                                {item.totalParcelasPendente > 0 && IconsUtil.contrato({size: 20, color: iconColorWarning})}
                                {item.totalParcelasAtrasadas > 0 && IconsUtil.contrato({size: 20, color: iconColorDanger})}
                            </View>
                            <ShowImageCliente 
                                width={60}
                                height={60}
                                urlPhoto={item.photo} 
                                amountFinancialLoansPending={item.totalParcelasAtrasadas} 
                                firsName={item.firstName} 
                                lastName={item.lastName} 
                            />
                            <View style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}>
                                <TextComponent text={`${item.firstName} ${item.lastName}`} fontSize={18} color={textColorPrimary} textAlign={"auto"} />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <ModalSystem  title={`${customerView?.firstName} ${customerView?.lastName}`} heightProp={850} setVisible={setModalVisible} visible={modalVisible} children={
                <View style={{ display: "flex", flexDirection: "column", gap: 10, alignItems:"center" }}>
                    <ShowImageCliente
                        urlPhoto={customerView.photo}
                        amountFinancialLoansPending={0}
                        firsName={customerView.firstName}
                        lastName={customerView.lastName}
                        width={160}
                        height={160}
                    />

                    <TouchableOpacity onPress={() => {setModalVisible(false), navigation.navigate("CriarEditarClientes", { clientEdit: customerView })}}>
                        <Ionicons name="pencil-sharp" size={26} color={textColorWarning} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setModalVisible(false), navigation.navigate("Financiamento", { clientFinanciamento: customerView })}}>
                        <Ionicons name="cash-sharp" size={26} color={textColorWarning} />
                    </TouchableOpacity>
                </View>
            } />

          
        </View>
    );
}
export default ListarCliente;