import { useCustomerDataBase } from "@/database/useCustomerDataBase";
import { CUSTOMER } from "@/types/customer";
import { useState } from "react";
import { Text, View } from "react-native";
import ButtonComponent from "../button";
import InputText from "../input";

const FormularioCustomer = () => {

    const [customer, setCustomer] = useState<CUSTOMER>( {endereco: {id:''}} as CUSTOMER);

    const customerDataBase = useCustomerDataBase();

    function handlerClear(){
        setCustomer({endereco: {id:''}} as CUSTOMER);
    }

    function handlerSave(){
        if(!customer.firstName || !customer.lastName || !customer.contact){
            alert("Preencha os campos obrigatórios.");
            return;
        }

       customerDataBase.create(customer)
            .then((result) => {
                if(result.insertedId){
                    alert("Cliente salvo com sucesso!");
                    handlerClear();
                }else{
                    alert("Erro ao salvar cliente.");
                }
            })
            .catch((error) => {
                console.error("Erro ao salvar cliente:", error);
                alert("Erro ao salvar cliente.");
            });
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Text>Formulario Customer</Text>
            <InputText 
                label={"Nome"} 
                placeholder="Digite o nome"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({...customer, firstName: text})} 
                value={customer.firstName}
            />

            <InputText 
                label={"Sobrenome"} 
                placeholder="Digite o sobrenome"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({...customer, lastName: text})} 
                value={customer.lastName}
            />

            <InputText 
                label={"Contato"} 
                placeholder="Digite o contato"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({...customer, contact: text})} 
                value={customer.contact} 
            />

             <InputText 
                label={"CEP"} 
                placeholder="Digite o CEP"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({
                    ...customer,
                    endereco: {...customer.endereco, cep: text}
                })} 
                value={customer.endereco?.cep ?? ""} 
            />

            <InputText 
                label={"LOGRADOURO"} 
                placeholder="Digite o logradouro"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({
                    ...customer,
                    endereco: {...customer.endereco, logradouro: text}
                })} 
                value={customer.endereco?.logradouro ?? ""} 
            />

            <InputText 
                label={"BAIRRO"} 
                placeholder="Digite o bairro"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({
                    ...customer,
                    endereco: {...customer.endereco, bairro: text}
                })} 
                value={customer.endereco?.bairro ?? ""} 
            />

            <InputText 
                label={"MUNICIPIO"} 
                placeholder="Digite o município"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({
                    ...customer,
                    endereco: {...customer.endereco, localidade: text}
                })} 
                value={customer.endereco?.localidade ?? ""} 
            />

            <InputText 
                label={"NUMERO"} 
                placeholder="Digite o número"
                width={300}  
                editable={true} 
                onChangeText={(text) => setCustomer({
                    ...customer,
                    endereco: {...customer.endereco, numero: text}
                })} 
                value={customer.endereco?.numero ?? ""} 
            />

            <View style={{ 
                display: "flex", 
                flexDirection: "row", 
                flexWrap:"wrap", 
                gap: 10, 
                marginTop: 20 ,
                justifyContent: "center"
            }}>
                <ButtonComponent nameButton={"SALVAR"} onPress={handlerSave} typeButton={"success"} width={300} />
                <ButtonComponent nameButton={"LIMPAR"} onPress={handlerClear} typeButton={"warning"} width={300} />
            </View>
        </View>
        
    )
}

export default FormularioCustomer;