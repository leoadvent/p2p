import { Dimensions, FlatList, TouchableOpacity, View } from "react-native"
import BaseScreens from "./BaseScreens"
import { CustomerDTO } from "../types/customerDTO"
import { useEffect, useState } from "react"
import api from "../integration/axiosconfig"
import TextComponent from "../components/text/text"
import { flatListBorderColor, textColorPrimary, textColorStatusBar, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import NewClient from "./newClient"

const MyClient = ({ navigation }:any) => {

    const [customerDTOFilter, setCustomerDTOFilter] = useState<CustomerDTO>({} as CustomerDTO)
    const [customersDTO, setCustomersDTO] = useState<CustomerDTO[]>([] as CustomerDTO[])

 

    const width = Dimensions.get("window").width;

    useEffect(() => {
        api.post("/customer/filter", customerDTOFilter).then((response) => {
            console.log("Clientes: ", response.data)
            setCustomersDTO(response.data.content)
        }).catch((error) => {
            console.error("Erro ao buscar clientes: ", error)
        }).finally(() => {
            console.log("Clientes: ", customersDTO)
        })
    }, [])

    return(
        <BaseScreens title=" ">
            <View style={{ height: 600, width: width, justifyContent: "center", alignItems: "center", gap: 20, padding: 20 }}>

                <FlatList 
                    data={customersDTO}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
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
                            <TextComponent textAlign="center" color={textColorPrimary} fontSize={16} text={item.firsName + " " + item.lastName } />
                            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Ionicons name="cash" size={26} color={textColorSuccess} />
                                <TouchableOpacity onPress={() => navigation.navigate("NewClient", { clientEdit: item })}>
                                    <Ionicons name="pencil-sharp" size={26} color={textColorWarning} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                
            </View>
        </BaseScreens>
    )
}
export default MyClient