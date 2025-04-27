import { Dimensions, FlatList, TouchableOpacity, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { useEffect, useState } from "react"
import { CustomerDTO } from "../types/customerDTO"
import api from "../integration/axiosconfig"
import { flatListBorderColor, textColorError, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import { Ionicons } from "@expo/vector-icons"
import { stylesGlobal } from "../constants/styles"

const CustomerDefaulting = ({ navigation }:any) => {

    const [customerDefaultin, setCustomerDefaulting] = useState<CustomerDTO[]>([])

    const width = Dimensions.get("window").width;

    useEffect(() => {
        api.get('/customer/defaulting').then((response) => {
            setCustomerDefaulting(response.data)
        }).catch((error) => {
            alert(error)
        })
    },[])
    return(
        <BaseScreens title=" ">
             <View style={ stylesGlobal.viewComponentBaseScree}>

                {Object.entries(customerDefaultin).length > 0 &&
                    <FlatList 
                        data={customerDefaultin}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("FinanciamentoPendentePorCliente", {customerId: item.id })}
                            >
                                <View style={{ 
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: width-40, 
                                    borderWidth: 1, 
                                    marginBottom: 10,
                                    borderBottomColor: flatListBorderColor,
                                    borderRadius: 5,
                                    padding: 10,
                                }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent: "space-between", gap: 10 }}>
                                        <Ionicons name="ribbon-outline" size={14} color={textColorError} />
                                        <TextComponent text={`${item.amountFinancialLoansPending}`} color={textColorPrimary} fontSize={16} textAlign={"center"} />
                                    </View>
                                    
                                    <TextComponent text={`${item.firsName} ${item.lastName}`} color={textColorPrimary} fontSize={16} textAlign={"center"} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                }
            </View>
        </BaseScreens>
    )
}
export default CustomerDefaulting