import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, TouchableOpacity, View } from "react-native";
import ButtonComponent from "../components/button";
import InputText from "../components/input";
import { FINANCIAMENTO, MODALIDADE } from "../types/financiamento";
import BaseScreens from "./BaseScreens";

const Financiamento = () => {

    const [financiamento, statementFinanciamento] = useState<FINANCIAMENTO>({} as FINANCIAMENTO)
    const [modalidade, setModalidade] = useState<MODALIDADE>(MODALIDADE.Parcelado)

    const [showPickerDataInicio, setShowPickerDataInicio] = useState(false)
    const [showPickerDataFinal, setShowPickerDataFinal] = useState(false)

    const [dataInicio, setDataInicio] = useState(new Date())
    const [dataFinal, setDataFinal] = useState(new Date())
    const [valorFinanciamento, setValorFinanciamento] = useState<string>("")
    const [taxaJuros, setTaxaJuros] = useState<string>("")
    const [valorDiario, setValorDiario] = useState<string>("")
    const [taxaJurosAtraso, setTaxaJurosAtraso] = useState<string>("")
    const [adicionalDiaAtraso, setAdicionalDiaAtraso] = useState<string>("")
    const [totalParcelas, setTotalParcelas] = useState<string>("")

    
    const route = useRoute();
    const { clientFinanciamento }: any = route.params ?? {}

    const width = Dimensions.get("window").width

    function calcularJurosDiario(){
        if(valorFinanciamento === "" && taxaJuros === ""){return}
        alert(valorFinanciamento + " " + taxaJuros )
    }

    useEffect(() => {calcularJurosDiario()}, [taxaJuros, valorFinanciamento])

    return(
        <BaseScreens title={`FINANCIAMENTO`} rolbackStack={true}>
            
            <View style={{ gap: 10 }}>
                <InputText 
                    width={330}
                    label={"Cliente *"} 
                    editable={false} 
                    value={`${clientFinanciamento.firstName} ${clientFinanciamento.lastName}`}
                />

                <ButtonComponent nameButton={`TIPO: ${modalidade}`} onPress={() => {setModalidade(modalidade === MODALIDADE.Parcelado ? MODALIDADE.CarenciaDeCapital : MODALIDADE.Parcelado)} } typeButton={"primary"} width={330} />

                <View style={{ width:330, display:"flex", flexDirection:"row", flexWrap:"wrap", gap: 20, justifyContent: "center", alignItems: "center" }}>
                    
                    <TouchableOpacity
                        onPress={() => setShowPickerDataInicio(true)}
                    >
                        <InputText 
                            label="Data Início"
                            editable={false}
                            width={150}
                            value={dataInicio.toLocaleDateString('pt-BR')}
                        />
                    </TouchableOpacity>

                    {showPickerDataInicio && (
                        <DateTimePicker
                            value={dataInicio}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowPickerDataInicio(false)
                                if (selectedDate) setDataInicio(selectedDate)
                            }}
                        />
                    )}

                    <TouchableOpacity
                        onPress={() => setShowPickerDataFinal(true)}
                    >
                        <InputText 
                            label="Data Final"
                            editable={false}
                            width={150}
                            value={dataFinal.toLocaleDateString('pt-BR')}
                        />
                    </TouchableOpacity>

                    {showPickerDataFinal && (
                        <DateTimePicker
                            value={dataFinal}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowPickerDataFinal(false)
                                if (selectedDate) setDataFinal(selectedDate)
                            }}
                        />
                    )}
                </View>
                
                <View style={{ width:330, display:"flex", flexDirection:"row", flexWrap:"wrap", gap: 20, justifyContent: "center", alignItems: "center" }}>

                    <InputText 
                            editable
                            label="Valor *" 
                            money={true}
                            keyboardType="numeric"
                            value={valorFinanciamento}
                            width={150}
                            onChangeText={(text) => {setValorFinanciamento(text)}}
                            placeholder="Valor Financiado"
                        />

                        <InputText 
                            editable
                            label="Juros Empréstimo *" 
                            keyboardType="numeric"
                            value={taxaJuros}
                            width={150}
                            percentage
                            onChangeText={(text) => { setTaxaJuros(text)}}
                            placeholder="Juros"
                        />

                        {modalidade === MODALIDADE.Parcelado && 
                            <>
                                <InputText 
                                    editable
                                    label="Juros Atraso *" 
                                    keyboardType="numeric"
                                    value={taxaJurosAtraso}
                                    width={150}
                                    percentage
                                    onChangeText={(text) => {setTaxaJurosAtraso(text)}}
                                />

                                <InputText 
                                    editable
                                    label="Adicional Por Dia Atraso *" 
                                    money
                                    keyboardType="numeric"
                                    value={adicionalDiaAtraso}
                                    width={150}
                                    onChangeText={(text) => { setAdicionalDiaAtraso(text)}}
                                />

                                <InputText 
                                    editable
                                    label="Quantidade Parcelas *" 
                                    keyboardType="numeric"
                                    value={totalParcelas}
                                    width={150}
                                    onChangeText={(text) => { setTotalParcelas(text)}}
                                />
                            </>
                        }

                        {modalidade === MODALIDADE.CarenciaDeCapital &&
                            <InputText 
                                editable={false}
                                label="Valor Diário *" 
                                money
                                keyboardType="numeric"
                                value={valorDiario}
                                width={150}
                                onChangeText={(text) => { setValorDiario(text)}}
                            />
                        }
                </View>

            </View>
        </BaseScreens>
    )
}

export default Financiamento