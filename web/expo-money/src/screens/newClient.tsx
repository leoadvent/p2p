import BaseScreens from "./BaseScreens";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { CustomerDTO } from "../types/customerDTO";
import InputText from "../components/inputText";
import ButtonComponent from "../components/button";
import api from "../integration/axiosconfig";
import TextComponent from "../components/text/text";
import { textColorError, textColorPrimary } from "../constants/colorsPalette ";
import { useRoute } from "@react-navigation/native";

const NewClient = ({ navigation } : any) => {

    const [customerDTO, setCustomerDTO] = useState<CustomerDTO>({endereco: {cep: ""}} as CustomerDTO)
    const [isSpinner, setIsSpinner] = useState<boolean>(false)
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")

    const route = useRoute();
    const { clientEdit } : any = route.params;
    const clientCopyEdit = clientEdit

    function handleSaveCustomer() {
        setIsSpinner(true)
        console.log("customerDTO CRIANDO: ", customerDTO)
        api.post("/customer", customerDTO).then((response) => {
            setMessage("Cliente cadastrado com sucesso!")
            setIsSuccess(true)
            handleClearCustomer()
        }).catch((error) => {
            setMessage("Erro ao cadastrar cliente." + error.message)
            setIsSuccess(false) 
        }).finally(() => {
            setIsSpinner(false)
            setTimeout(() => {
                setIsSuccess(false)
                setMessage("")
            }, 3000)
        })
    }

    function handleClearCustomer() {
        setCustomerDTO({endereco: {cep: ""}} as CustomerDTO)
    }

    function handleFindAdrresByCEP() {
        if(customerDTO.endereco.cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${customerDTO.endereco.cep}/json/`)
                .then((response) => response.json())
                .then((data) => {
                    setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, ...data}})
                })
                .catch((error) => {
                    console.error("Erro ao buscar endereço: ", error)
                })
        } else {
            alert("CEP inválido")
        }
    }

    useEffect(() => {
        if(customerDTO.endereco.cep.length === 8) {
            handleFindAdrresByCEP()
        }

        if(customerDTO.firsName && customerDTO.lastName && customerDTO.contact) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }

    }, [customerDTO.endereco.cep, customerDTO.firsName, customerDTO.lastName, customerDTO.contact])

    alert("clientEdit: " + JSON.stringify(clientEdit))

    useEffect(() => {
        if(Object.entries(clientEdit).length > 0) {
            alert("EDITANDO CLIENTE " + clientEdit.firsName)
            if(!clientEdit.endereco) {
                setCustomerDTO({...clientEdit, endereco: {cep: ""}} as CustomerDTO) 
            }
            setCustomerDTO(clientCopyEdit)
            navigation.setParams({ clientEdit: {} })
        }else {
            alert("CRIANDO NOVO CLIENTE")
            setCustomerDTO({endereco: {cep: ""}} as CustomerDTO)
        }
    }, [])

    return (
        <BaseScreens title="" >
            <View style={{ height: 600, justifyContent: "center", alignItems: "center", gap: 20 }}>
                <KeyboardAvoidingView>
                    <ScrollView style={{ padding: 20, gap: 20 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", padding: 20 }}>
                        <InputText 
                            label="Nome *" 
                            placeholder="Nome" 
                            value={customerDTO.firsName}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, firsName: text})} width={300}/> 

                        <InputText
                            label="Sobrenome *"
                            placeholder="Sobrenome"
                            value={customerDTO.lastName}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, lastName: text})} width={300}/>

                        <InputText
                            label="Contato *" 
                            placeholder="Contato"
                            value={customerDTO.contact}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, contact: text})} width={300}/> 
                        
                        <InputText
                            label="CEP"
                            placeholder="CEP"
                            keyboardType="numeric"
                            value={customerDTO.endereco.cep}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, cep: text}})} width={300}/>
                        
                        <InputText
                            label="Rua"
                            placeholder="Rua"
                            value={customerDTO.endereco.logradouro}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, logradouro: text}})} width={300}/>

                        <InputText
                            label="Número"
                            placeholder="Número"
                            value={customerDTO.endereco.numero}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, numero: text}})} width={300}/>

                        <InputText
                            label="Complemento"
                            placeholder="Complemento"
                            value={customerDTO.endereco.complemento}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, complemento: text}})} width={300}/>

                        <InputText
                            label="Bairro"
                            placeholder="Bairro"
                            value={customerDTO.endereco.bairro}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, bairro: text}})} width={300}/>

                        <InputText
                            label="Cidade"
                            placeholder="Cidade"
                            value={customerDTO.endereco.localidade}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, localidade: text}})} width={300}/>
                        
                        <InputText
                            label="Municipio"
                            placeholder="Municipio"
                            value={customerDTO.endereco.localidade}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, localidade: text}})} width={300}/>

                        <InputText
                            label="Estado"
                            placeholder="Estado"
                            value={customerDTO.endereco.estado}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, estado: text}})} width={300}/>

                        <InputText
                            label="UF"
                            placeholder="UF"
                            value={customerDTO.endereco.uf}
                            onChangeText={(text) => setCustomerDTO({...customerDTO, endereco: {...customerDTO.endereco, uf: text}})} width={300}/>
                        
                    </ScrollView>

                </KeyboardAvoidingView>
                <TextComponent textAlign="center" color={isSuccess ? textColorPrimary : textColorError} fontSize={16} text={message} />
                <View style={{ display: "flex", flexDirection: "row", gap: 10, width: "80%", justifyContent: "center", alignItems: "center"}}>
                    <ButtonComponent nameButton="Limpar" onPress={() => handleClearCustomer()} typeButton="warning" width="50%"/> 
                    <ButtonComponent nameButton="Salvar" onPress={() => handleSaveCustomer()}  typeButton="success" width="50%" isSpinner={isSpinner} isDisabled={isDisabled}/> 
                </View>
            </View>
        </BaseScreens>
    )
}
export default NewClient;