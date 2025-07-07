import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, TouchableOpacity, View } from "react-native";
import ButtonComponent from "../components/button";
import InputText from "../components/input";
import MeuSelect from '../components/picker';
import { FINANCIAMENTO, MODALIDADE, PERIODOCIDADE } from "../types/financiamento";
import BaseScreens from "./BaseScreens";

const Financiamento = () => {

    const [financiamento, statementFinanciamento] = useState<FINANCIAMENTO>({} as FINANCIAMENTO)
    const [modalidade, setModalidade] = useState<MODALIDADE>(MODALIDADE.Parcelado)

    const [showPickerDataInicio, setShowPickerDataInicio] = useState(false)
    const [showPickerDataFinal, setShowPickerDataFinal] = useState(false)

    const [dataInicio, setDataInicio] = useState(new Date())
    const [dataFinal, setDataFinal] = useState(() => {
        const hoje = new Date();
        const dataMais30Dias = new Date();
        dataMais30Dias.setDate(hoje.getDate() + 30);
        return dataMais30Dias;
    });
    const [valorFinanciamento, setValorFinanciamento] = useState<string>("")
    const [taxaJuros, setTaxaJuros] = useState<string>("")
    const [valorDiario, setValorDiario] = useState<string>("")
    const [taxaJurosAtraso, setTaxaJurosAtraso] = useState<string>("")
    const [adicionalDiaAtraso, setAdicionalDiaAtraso] = useState<string>("")
    const [totalParcelas, setTotalParcelas] = useState<string>("1")
    const [periodocidade, setPeriodocidade] = useState<string>("")
    const [valorParcela, setValorParcela] = useState<string>("")

    
    const route = useRoute();
    const { clientFinanciamento }: any = route.params ?? {}

    const width = Dimensions.get("window").width

    function calculaQuantidadeDeParcela() {
    if (!dataInicio || !dataFinal || !periodocidade) return;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFinal);

    if (fim <= inicio) {
        setTotalParcelas('0');
        return;
    }

    const diffEmMilissegundos = fim.getTime() - inicio.getTime();
    const diffEmDias = diffEmMilissegundos / (1000 * 60 * 60 * 24);

    let total = 0;

    switch (periodocidade.toLowerCase()) {
        case 'mensal':
            total = Math.ceil(diffEmDias / 30); // ou usar cálculo por mês exato se preferir
            break;
        case 'quinzenal':
            total = Math.ceil(diffEmDias / 15);
            break;
        case 'semanal':
            total = Math.ceil(diffEmDias / 7);
            break;
        default:
            total = 0;
    }

    setTotalParcelas(total.toString());
}


    function calcularJurosDiario() {
        if (!valorFinanciamento || !taxaJuros) return;

        // Normaliza valores (R$ e %)
        const valorNormalizado = valorFinanciamento.replace(/\./g, '').replace(',', '.');
        const taxaNormalizada = taxaJuros.replace(/\./g, '').replace(',', '.').replace('%', '');

        // Converte para número
        const numValor = parseFloat(valorNormalizado);
        const numTaxa = parseFloat(taxaNormalizada);

        // Garante que são números válidos
        if (isNaN(numValor) || isNaN(numTaxa)) {
            setValorDiario("Valor inválido");
            return;
        }

        // Cálculo dos juros diários
        const valDiario = ((numValor * numTaxa) / 100) / 30;

        // Formata para moeda real
        const valorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valDiario);

        // Atualiza estado
        setTaxaJurosAtraso(taxaJuros)
        setValorDiario(valorFormatado)
        setAdicionalDiaAtraso(valorFormatado)
        setValorParcela((parseFloat(valorNormalizado) / parseFloat(totalParcelas)).toString())
    }

    useEffect(() => {calcularJurosDiario()}, [taxaJuros, valorFinanciamento])

    useEffect(() => {calculaQuantidadeDeParcela()}, [periodocidade, dataInicio, dataFinal])


    return(
        <BaseScreens title={`FINANCIAMENTO`} rolbackStack={true}>
            
            <View style={{ gap: 20 }}>
                <InputText 
                    width={330}
                    label={"Cliente *"} 
                    editable={false} 
                    value={`${clientFinanciamento.firstName} ${clientFinanciamento.lastName}`}
                />

                <ButtonComponent nameButton={`TIPO: ${modalidade}`} onPress={() => {setModalidade(modalidade === MODALIDADE.Parcelado ? MODALIDADE.CarenciaDeCapital : MODALIDADE.Parcelado)} } typeButton={"primary"} width={330} />

                <MeuSelect
                    inputError={false}
                    label='Periodicidade *'
                    width={335}
                    selecionado={setPeriodocidade}
                    options={
                        [
                            {label:PERIODOCIDADE.Quinzenal, value:PERIODOCIDADE.Quinzenal, default:false},
                            {label:PERIODOCIDADE.Semanal,   value:PERIODOCIDADE.Semanal, default:false},
                            {label:PERIODOCIDADE.Mensal,    value:PERIODOCIDADE.Mensal, default:true}
                        ]
                    }                    
                />

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
                                    placeholder='Juros Atraso'
                                    keyboardType="numeric"
                                    value={taxaJurosAtraso}
                                    width={150}
                                    percentage
                                    onChangeText={(text) => {setTaxaJurosAtraso(text)}}
                                />

                                <InputText 
                                    editable
                                    label="Adicional Por Dia Atraso *" 
                                    placeholder='Adicional Por Dia Atraso'
                                    money
                                    keyboardType="numeric"
                                    value={adicionalDiaAtraso}
                                    width={150}
                                    onChangeText={(text) => { setAdicionalDiaAtraso(text)}}
                                />

                                <InputText 
                                    editable={false}
                                    label="Quantidade Parcelas *" 
                                    keyboardType="numeric"
                                    value={totalParcelas}
                                    width={150}
                                    onChangeText={(text) => { setTotalParcelas(text)}}
                                />

                                <InputText 
                                    editable={false}
                                    label="Valor Parcelas *" 
                                    keyboardType="numeric"
                                    money={true}
                                    value={Number(valorParcela).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    width={150}
                                    onChangeText={(text) => { setValorParcela(text)}}
                                />
                            </>
                        }

                        {modalidade === MODALIDADE.CarenciaDeCapital &&
                            <InputText 
                                editable={false}
                                label="Valor Diário *" 
                                placeholder='Valor Diário'
                                money
                                keyboardType="numeric"
                                value={valorDiario}
                                width={150}
                                onChangeText={(text) => { setValorDiario(text)}}
                            />
                        }

                    
                </View>
            
                <ButtonComponent nameButton={'SIMULAR'} onPress={() => {}} typeButton={'primary'} width={335} />
            </View>
        </BaseScreens>
    )
}

export default Financiamento