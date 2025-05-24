import BaseScreens from "./BaseScreens";
import { ScrollView, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { CustomerDTO } from "../types/customerDTO";
import InputText from "../components/inputText";
import ButtonComponent from "../components/button";
import api from "../integration/axiosconfig";
import TextComponent from "../components/text/text";
import { textColorError, textColorPrimary } from "../constants/colorsPalette ";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { stylesGlobal } from "../constants/styles";
import CameraSystem from "../components/camera";
import React from "react";

const NewClient = ({ navigation }: any) => {
    const [customerDTO, setCustomerDTO] = useState<CustomerDTO>({ endereco: { cep: "" } } as CustomerDTO);
    const [isSpinner, setIsSpinner] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const [uriPhtograph, setUriPhtograph] = useState("");
    const [isCameraActive, setIsCameraActive] = useState(false);

    const route = useRoute();
    const { clientEdit }: any = route.params ?? {};  // segurança extra

    function handleSaveCustomer() {
        setIsSpinner(true);

        const formData = new FormData();

        if (uriPhtograph) {
            formData.append('photoFile', {
                uri: uriPhtograph,
                type: 'image/jpeg',
                name: 'minhaImagem.jpg'
            } as any);
        }

        if (customerDTO.id != null) {
            formData.append('id', customerDTO.id);
        }

        formData.append('firsName', customerDTO.firsName);
        formData.append('lastName', customerDTO.lastName);
        formData.append('contact', customerDTO.contact);
        formData.append('photo', customerDTO.photo);

        if (customerDTO.endereco.id != null) {
            formData.append('endereco.id', customerDTO.endereco.id);
        }

        Object.entries(customerDTO.endereco).forEach(([key, value]) => {
            formData.append(`endereco.${key}`, String(value ?? ""));
        });

        console.log("customerDTO CRIANDO: ", formData);

        api.post("/customer", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                setMessage("Cliente cadastrado com sucesso!");
                setIsSuccess(true);
                handleClearCustomer();
            })
            .catch((error) => {
                setMessage("Erro ao cadastrar cliente: " + error.message);
                setIsSuccess(false);
            })
            .finally(() => {
                setIsSpinner(false);
                setTimeout(() => {
                    setIsSuccess(false);
                    setMessage("");
                }, 3000);
            });
    }

    function handleClearCustomer() {
        setCustomerDTO({ endereco: { cep: "" } } as CustomerDTO);
        setUriPhtograph("");
        setIsCameraActive(false);
    }

    function handleFindAddressByCEP() {
        if (customerDTO.endereco.cep?.length === 8) {
            fetch(`https://viacep.com.br/ws/${customerDTO.endereco.cep}/json/`)
                .then((response) => response.json())
                .then((data) => {
                    setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, ...data } });
                })
                .catch((error) => {
                    console.error("Erro ao buscar endereço: ", error);
                });
        } else {
            alert("CEP inválido");
        }
    }

    useEffect(() => {
        if (customerDTO.endereco.cep?.length === 8) {
            handleFindAddressByCEP();
        }

        if (customerDTO.firsName && customerDTO.lastName && customerDTO.contact) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [customerDTO.endereco.cep]);

    useFocusEffect(
        React.useCallback(() => {
            if (clientEdit && Object.keys(clientEdit).length > 0) {
                console.log("EDITI: ", clientEdit);
                setCustomerDTO({
                    ...clientEdit,
                    endereco: clientEdit.endereco ?? { cep: "" }
                } as CustomerDTO);
                //navigation.setParams({ clientEdit: {} });
            } else {
                setCustomerDTO({ endereco: { cep: "" } } as CustomerDTO);
            }
        }, [clientEdit])
    );

    return (
        <BaseScreens title="">
            <View style={stylesGlobal.viewComponentBaseScree}>
                <ButtonComponent
                    nameButton={"FOTO"}
                    onPress={() => setIsCameraActive(!isCameraActive)}
                    typeButton={"primary"}
                    width={"100%"}
                />
                <CameraSystem
                    setUriPhtograph={setUriPhtograph}
                    isCameraActive={isCameraActive}
                    setIsCameraActive={setIsCameraActive}
                />

                {uriPhtograph ? (
                    <View style={{ borderRadius: 10, overflow: "hidden", borderWidth: 2, borderColor: "rgb(255,255,255)" }}>
                        <Image source={{ uri: uriPhtograph }} style={{ width: 200, height: 200 }} />
                    </View>
                ) : null}

                <ScrollView
                    style={{ padding: 20 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: "center", padding: 20, gap: 20 }}
                >
                    <InputText
                        editable
                        label="Nome *"
                        placeholder="Nome"
                        value={customerDTO.firsName}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, firsName: text })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Sobrenome *"
                        placeholder="Sobrenome"
                        value={customerDTO.lastName}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, lastName: text })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Contato *"
                        placeholder="Contato"
                        value={customerDTO.contact}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, contact: text })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="CEP"
                        placeholder="CEP"
                        keyboardType="numeric"
                        value={customerDTO.endereco.cep}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, cep: text } })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Rua"
                        placeholder="Rua"
                        value={customerDTO.endereco.logradouro}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, logradouro: text } })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Número"
                        placeholder="Número"
                        value={customerDTO.endereco.numero}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, numero: text } })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Complemento"
                        placeholder="Complemento"
                        value={customerDTO.endereco.complemento}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, complemento: text } })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Bairro"
                        placeholder="Bairro"
                        value={customerDTO.endereco.bairro}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, bairro: text } })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Cidade"
                        placeholder="Cidade"
                        value={customerDTO.endereco.localidade}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, localidade: text } })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="Estado"
                        placeholder="Estado"
                        value={customerDTO.endereco.estado}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, estado: text } })}
                        width={300}
                    />

                    <InputText
                        editable
                        label="UF"
                        placeholder="UF"
                        value={customerDTO.endereco.uf}
                        onChangeText={(text) => setCustomerDTO({ ...customerDTO, endereco: { ...customerDTO.endereco, uf: text } })}
                        width={300}
                    />
                </ScrollView>

                <ButtonComponent nameButton="Limpar" onPress={handleClearCustomer} typeButton="warning" width="50%" />
                <ButtonComponent nameButton="Salvar" onPress={handleSaveCustomer} typeButton="success" width="50%" isSpinner={isSpinner} isDisabled={isDisabled} />
                <TextComponent textAlign="center" color={isSuccess ? textColorPrimary : textColorError} fontSize={16} text={message} />
            </View>
        </BaseScreens>
    );
};

export default NewClient;
