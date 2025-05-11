import { Dimensions, FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import BaseScreens from "./BaseScreens";
import { stylesGlobal } from "../constants/styles";
import { useRoute } from "@react-navigation/native";
import TextComponent from "../components/text/text";
import ModalSystem from "../components/modal";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { CustomerCommitmentItemDTO } from "../types/customerCommitmentItemDTO";
import InputText from "../components/inputText";
import ButtonComponent from "../components/button";
import api from "../integration/axiosconfig";
import { CustomerDTO } from "../types/customerDTO";
import { flatListBorderColor, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette ";

const CustomerCommitment = () => {

    const route = useRoute();
    const { customerId } : any = route.params;

    const width = Dimensions.get("window").width;
    
    const [pledge, setPledge] = useState<CustomerCommitmentItemDTO>({} as CustomerCommitmentItemDTO);
    const [valueItem, setValueItem] = useState<string>("");
    const [idItem, setIdItem] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const[isLoading, setIsLoading] = useState<boolean>(false);
    const[customer, setCustomer] = useState<CustomerDTO>({} as CustomerDTO);
    const[itensCustomerCommitment, setItensCustomerCommitment] = useState<CustomerCommitmentItemDTO[]>([] as CustomerCommitmentItemDTO[]);

    useEffect(() => {
        api.get(`/customer/findById/${customerId}`).then((response) => {
            setCustomer(response.data);
           }).catch((error) => {
            alert("Erro ao buscar cliente" + error);
           })

        api.get(`/customerCommitment/findByCustomer/${customerId}`).then((response) => {
            setItensCustomerCommitment(response.data);
           }).catch((error) => {
            alert("Erro ao buscar itens do cliente" + error);
           })
    }, [customerId])

    function handlerCleanItemModal() {
        setPledge({} as CustomerCommitmentItemDTO);
        setValueItem("");
        setIdItem("");
    }

    function handlerEditItem(item: CustomerCommitmentItemDTO) {
        setPledge(item);
        setValueItem(item.valueItemFormated ? item.valueItemFormated : "");
        setIdItem(item.id ? item.id : "");
        setIsModalVisible(true);
    }

    function handlerSaveItem() {

        setIsLoading(true);
        const dados: CustomerCommitmentItemDTO = {
            id: idItem,
            customer: customer,
            nameItem: pledge.nameItem,
            descriptionItem: pledge.descriptionItem,
            valueItem: parseFloat(valueItem.replaceAll(".","").replace(",", ".")),
            warranty: false,
            committed: false
        }

        api.post(`/customerCommitment/addItemOrUpdate/${customer.id}`, dados).then((response) => {
            alert("Item adicionado com sucesso");
            handlerCleanItemModal();
        }).catch((error) => { 
            alert("Erro ao adicionar item" + error);
        }).finally(() => { 
            setIsLoading(false);
         });
    }

    return (
        <BaseScreens title={`GARANTIA CLIENTE`} rolbackStack>
            <View style={ stylesGlobal.viewComponentBaseScree}>
                <View style={{ display:"flex",  zIndex: 10, flexDirection:"row", justifyContent:"space-between", alignItems:"center", width: "100%", padding: 10, backgroundColor: "rgb(36, 36, 36)", borderRadius: 10 }}>
                    <TextComponent text={`${customer.firsName} ${customer.lastName}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                    
                    <ModalSystem title="Adcionar Emepnho" setVisible={setIsModalVisible} visible={isModalVisible} buttonClose={
                            <View style={{ flexDirection: "row", alignItems: "center", padding: 5, backgroundColor: "rgb(0, 122, 255)", borderRadius: 5 }}>
                                <Ionicons name="add-circle-outline" size={26} color="white" />
                            </View>}
                    >  
                    
                        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly", width:"90%"}}>
                            <TextComponent text="Adcionar Emepnho" color={"rgb(255, 255, 255)"} fontSize={10} textAlign={"auto"} />
                            <InputText 
                                width={258}
                                label={"Nome do Item *"}
                                value={pledge.nameItem}
                                onChangeText={(text) => setPledge({ ...pledge, nameItem: text })}
                                placeholder={"Nome"} 
                                editable={true}                        
                            />
                            <InputText 
                                width={258}
                                label={"Descrição do Item *"}
                                value={pledge.descriptionItem}
                                onChangeText={(text) => setPledge({ ...pledge, descriptionItem: text })}
                                placeholder={"Descrição"} 
                                editable={true}                        
                            />
                            <InputText 
                                width={258}
                                label={"Valor do Item *"}
                                value={valueItem}
                                onChangeText={(text) => setValueItem(text)}
                                placeholder={"Valor"} 
                                money={true}
                                editable={true}    
                                keyboardType="numeric"                   
                            />

                            <ButtonComponent 
                                nameButton={"Salvar"} 
                                onPress={() => {handlerSaveItem()}} 
                                typeButton={"success"} width={"100%"} 
                                isSpinner={isLoading}  
                                isDisabled={isLoading}  
                            />
                                
                        </View>
                    </ModalSystem>
                </View>

                {Object.keys(itensCustomerCommitment).length > 0 && 
                    <ScrollView style={{ width: "100%", marginTop: 10  }}>
                    <FlatList 
                        data={itensCustomerCommitment}
                        keyExtractor={(item) => item.id ? item.id : ""}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={stylesGlobal.viewComponentBaseScree} onPress={() => {!item.warranty && handlerEditItem(item)}}>
                                <View style={{ 
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                width: width-40, 
                                                borderWidth: 1, 
                                                marginBottom: 10,
                                                borderBottomColor: flatListBorderColor,
                                                borderRadius: 5,
                                                padding: 10,
                                                gap: 10
                                            }}
                                >
                                    <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems:"center", justifyContent:"space-between"}}>
                                        {item.warranty &&
                                            <View style={{ display: "flex", flexDirection: "row", gap:10, alignItems:"center"}}> 
                                                <Ionicons name="checkmark-circle-outline" size={15} color={textColorWarning}/>
                                                <TextComponent text={`Usando em Garantia`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                                            </View>   
                                        }
                                        {item.committed &&
                                            <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems:"center"}}>        
                                                <Ionicons name="checkmark-circle-outline" size={15} color={textColorSuccess}/>
                                                <TextComponent text={`Emepnhorado`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />    
                                            </View>
                                        }
                                    </View>

                                    <TextComponent text={`${item.valueItemFormated}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                                    
                                    <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems:"center"}}>
                                        <Ionicons name="bag-check-outline" size={15} color={textColorPrimary}/>
                                        <TextComponent text={`${item.nameItem}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                                    </View>

                                    <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems:"center"}}>
                                        <Ionicons name="clipboard-outline" size={15} color={textColorPrimary}/>
                                        <TextComponent text={`${item.descriptionItem}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />
                                    </View>

                                </View>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                    </ScrollView>
                }

            </View>
        </BaseScreens>
    )
}
export default CustomerCommitment;