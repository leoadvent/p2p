import { View } from "react-native";
import { backgroundPrimary, textColorPrimary } from "../constants/colorsPalette ";
import BaseScreens from "./BaseScreens";
import TextComponent from "../components/text/text";
import InputText from "../components/inputText";
import { useEffect, useState } from "react";
import { Realm } from "../types/createType";
import ButtonComponent from "../components/button";
import api from "../integration/axiosconfig";

const CreateRealm = () => {

    const [createRealm, setCreateRealm] = useState<Realm>({clientId: "", password: "", user: {firstName: "", lastName: "", email: ""}} as Realm);
    const [isSpinner, setIsSpinner] = useState(false);
    const [messageError, setMessageError] = useState<string>("");
    const [messageSuccess, setMessageSuccess] = useState<string>("");

    function handlerCleanForm() {
        setCreateRealm({clientId: "", password: "", user: {firstName: "", lastName: "", email: ""}}  as Realm);
        setMessageError("");
        setMessageSuccess("");
    }

    function handleCreateRealm() {
        setIsSpinner(true);

        api.post("/keycloak", createRealm)
            .then((response) => {
                handlerCleanForm();
                setMessageSuccess("Novo cliente criado com sucesso!");
            })
            .catch((error) => {
                setMessageError("Erro ao criar o Realm. Verifique os dados e tente novamente.");
            })
            .finally(() => {  
                setIsSpinner(false);
            });
    }

    useEffect(() => {

        const nameClientId = createRealm.user.firstName.toUpperCase().trim() + "_" + createRealm.user.lastName.replaceAll(' ', '_').toUpperCase().trim();

        setCreateRealm((prev) => ({...prev, 
            realmName: `REALM_${nameClientId}`, 
            clientId: `CLIENT_${nameClientId}`,
            enableUser: true,
            enabled: true,
            emailVerified: true,
            description: `Realm criado para o usuário ${prev.user.firstName} ${prev.user.lastName}`,
            user: {
                ...prev.user, emailVerified: true,
            username: createRealm.user.email.trim(),
            }
        }));

    }, [createRealm.user.firstName, createRealm.user.lastName, createRealm.user.email]);


    return(
        <BaseScreens backgroundColor={backgroundPrimary} title="Novo Usuário" rolbackStack={true}>
            <View style={{ display: "flex", gap: 20, alignItems: "center", flex: 1, padding: 10}}>
                <TextComponent textAlign="auto" color={textColorPrimary} fontSize={18} text={"Novo Usuário"}/> 

                <InputText 
                    editable
                    label="Nome" 
                    onChangeText={ (text) => setCreateRealm((prev) => ({...createRealm, user: {...prev.user, firstName: text}}))} 
                    value={createRealm.user.firstName} 
                    width={300}
                    inputError={false}
                />

                <InputText 
                    editable
                    label="Sobrenome" 
                    onChangeText={ (text) => setCreateRealm((prev) => ({...createRealm, user: {...prev.user, lastName: text}}))} 
                    value={createRealm.user.lastName} 
                    width={300}
                    inputError={false}
                />

                <InputText 
                    editable
                    label="Email" 
                    onChangeText={ (text) => setCreateRealm((prev) => ({...createRealm, user: {...prev.user, email: text}}))} 
                    value={createRealm.user.email} 
                    width={300}
                    inputError={false}
                    keyboardType="email-address"
                />

                <InputText 
                    editable
                    label="Senha" 
                    onChangeText={ (text) => setCreateRealm((prev) => ({...createRealm, password: text}))} 
                    value={createRealm.password} 
                    width={300}
                    inputError={false}
                    isPassword={true}
                />

                <View style={{ display: "flex", flexDirection: "row", gap: 10, width: "85%", justifyContent: "center", alignItems: "center"}}>
                    <ButtonComponent nameButton="LIMPAR" typeButton="warning" width="50%" onPress={() => handlerCleanForm() } isSpinner={false} isDisabled={false}/>  
                    <ButtonComponent nameButton="CRIAR" typeButton="primary" width="50%" onPress={() => handleCreateRealm() } isSpinner={isSpinner} isDisabled={false}/>
                </View>

                <TextComponent textAlign="center" color="rgb(255, 255, 255)" fontSize={12} text={messageError}/> 
                <TextComponent textAlign="center" color="rgb(255, 255, 255)" fontSize={12} text={messageSuccess}/> 
                
            </View>
        </BaseScreens>
    )
}
export default CreateRealm;