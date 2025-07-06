import { useCustomerDataBase } from "@/database/useCustomerDataBase";
import apiEndereco from "@/src/integration/apiEndereco";
import { CUSTOMER } from "@/types/customer";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ButtonComponent from "../button";
import InputText from "../input";
import ModalSystem from "../modal";
import TextComponent from "../text/text";

const FormularioCustomer = () => {

    const [customer, setCustomer] = useState<CUSTOMER>( {endereco: {id:''}} as CUSTOMER);
    const [modal, setModal] = useState<boolean>(false);
    const [mensagemModal, setMensagemModal] = useState<string>("");
    const [tituliModal, setTituloModal] = useState<string>("");

    const customerDataBase = useCustomerDataBase();

    function handlerClear(){
        setCustomer({endereco: {id:''}} as CUSTOMER);
    }

    useEffect(() => {
        if(customer.endereco?.cep?.length === 9){
            apiEndereco.get(`${customer.endereco.cep}/json`).then((response) => {
                setModal(true);
                setTituloModal("BUSCAR CEP");
                setMensagemModal(`Endereço localizado via CEP`);
                setCustomer({
                    ...customer,
                    endereco: {
                        ...customer.endereco,
                        logradouro: response.data.logradouro,
                        bairro: response.data.bairro,
                        localidade: response.data.localidade,
                        uf: response.data.uf,
                        estado: response.data.uf
                    }
                });
            })
        }
    },[customer.endereco?.cep]);

    function handlerSave(){
        if(!customer.firstName || !customer.lastName || !customer.contact){
            setModal(true);
            setMensagemModal("Preencha os campos obrigatórios.");
            return;
        }

       customerDataBase.create(customer)
            .then((result) => {
                if(result.insertedId){
                    setModal(true);
                    setTituloModal("SUCESSO");
                    setMensagemModal("Cliente salvo com sucesso!");
                    handlerClear();
                }else{
                    setModal(true);
                    setTituloModal("ERRO");
                    setMensagemModal("Erro ao salvar cliente.");
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
                phone={true}
                keyboardType="phone-pad"
            />

             <InputText 
                label={"CEP"} 
                placeholder="Digite o CEP"
                width={300}  
                editable={true} 
                cep={true}
                keyboardType="numeric"
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

            <ModalSystem 
                title={tituliModal}
                visible={modal} 
                setVisible={setModal} 
                buttonClose={<Text style={{color: "white"}}>Fechar</Text>} 
                heightProp={400} 
                widthProp={400}
            >
                <View style={{gap: 50, display: "flex", flexDirection: "column", width: "100%"}}>
                    <TextComponent text={mensagemModal} color={"rgb(247, 238, 238)"} fontSize={14} textAlign={"center"} />
                    <ButtonComponent 
                        nameButton={"FECHAR"} onPress={() => {setModal(false)}} typeButton={"primary"} width={"auto"} />
                </View>
            </ModalSystem>
        </View>
        
    )
}

export default FormularioCustomer;