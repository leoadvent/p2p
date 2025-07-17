import { flatListBorderColor, iconColorDanger, iconColorSuccess, iconColorWarning, textColorPrimary } from "@/constants/colorsPalette ";
import { useCustomerDataBase } from "@/database/useCustomerDataBase";
import { IconsUtil } from "@/src/utils/iconsUtil";
import { CUSTOMER } from "@/types/customer";
import { useFocusEffect } from '@react-navigation/native';
import React, { Dispatch, SetStateAction, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import ShowImageCliente from "../imageAvatar";
import ModalSystem from "../modal";
import TextComponent from "../text/text";
import DetalharCliente from "./detalharCliente";

interface Props {
    setNomeFiltroParam: Dispatch<SetStateAction<string>>
    nomeFiltroParam: string
}
const ListarCliente = ( {setNomeFiltroParam, nomeFiltroParam} : Props) => {

    const [customers, setCustomers] = useState<CUSTOMER[]>([]);
    const [customerView, setCustomerView] = useState<CUSTOMER>({} as CUSTOMER);
    const [nomeFiltro, setNomeFiltro] = useState<string>("");

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    
    const customerDataBase = useCustomerDataBase();

    const width = Dimensions.get("screen").width; // Assuming a fixed width for the FlatList items
    
    async function handlerBuscarClientes() {
        setCustomers(await customerDataBase.buscarPorNome(nomeFiltroParam));
    }

    useFocusEffect(
        React.useCallback(() => {
            handlerBuscarClientes();
        }, [nomeFiltroParam])
    )


    return (
        <View>
            <TextComponent text={"LISTAR CLIENTES"} color={textColorPrimary} fontSize={7} textAlign={"left"} />

            <FlatList 
                data={
                        [...customers].sort((a, b) => {
                            const aEmAtraso     = a.totalParcelasAtrasadas > 0 ? 1 : 0
                            const bEmAtraso     = b.totalParcelasAtrasadas > 0 ? 1 : 0
                            const aEmPendencia  = a.totalParcelasPendente  > 0 ? 1 : 0
                            const bEmPendencia  = b.totalParcelasPendente  > 0 ? 1 : 0
                            if(bEmAtraso != aEmAtraso){
                                return bEmAtraso - aEmAtraso
                            }

                            if(b.totalParcelasAtrasadas !== a.totalParcelasAtrasadas){
                                return b.totalParcelasAtrasadas - a.totalParcelasAtrasadas
                            }

                            if(bEmPendencia != aEmPendencia){
                                return bEmPendencia - aEmPendencia
                            }

                            if(b.totalParcelasPendente !== a.totalParcelasPendente){
                                return b.totalParcelasPendente - a.totalParcelasPendente
                            }

                            return a.firstName.localeCompare(b.firstName)
                        })
                    } 
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
            <ModalSystem  title={`${customerView?.firstName} ${customerView?.lastName}`} heightProp={1050} setVisible={setModalVisible} visible={modalVisible} children={
                <DetalharCliente customer={customerView} setModalVisible={setModalVisible} />
            } />

          
        </View>
    );
}
export default ListarCliente;